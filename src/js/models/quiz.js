var seedRandom = require("seedrandom");
import countryData from "../JSON/CountryData.json";
import continentIds from "../JSON/ContinentId.json";

export default class Quiz {
  constructor(quizData) {
    // check if there is random seed
    if (quizData.seed) {
      this.seed = queryString.seed;
    } else {
      this.seed = (Math.random() + "").split(".")[1];
    }
    this.numQuestions = quizData.numQuestions;
    this.seedRandom = seedRandom(this.seed);
    this.correctCount = 0;
    this.questionIndex = 0; //current question number
    this.idsList = this.getIdsList(quizData.continentsMask);
    this.idsAmount = this.idsList.length - 1;
    this.questions = [];
    this.questionType;
  }

  getQuestionIndex() {
    return this.questionIndex;
  }

  getCorrectCount() {
    console.log("the number of correct answer",this.correctCount);
    return this.correctCount;
  }

  getCorrectIndex() {
    const question = this.getCurrentQuestion();
    let id;
    for (let i = 0; i < question.options.length; i++) {
      if (question.options[i].id == question.answer) {
        id = i;
        break;
      }
    }
    return id;
  }

  getNumQuestions() {
    return this.numQuestions;
  }

  getIdsList(continentMask) {
    let ids = [];
    continentIds.forEach((continentArray, i) => {
      if (continentMask == "0000000" || continentMask[i] == "1") {
        ids.push(...continentArray);
      }
    });
    return ids;
  }

  genQuestions(questionType) {
    this.questionType = questionType;
    this.genQuestionNAnswers();
    this.genOptions();
  }

  genQuestionNAnswers() {
    //if true flag question if false capital question
    let usedIds = [];
    for (let i = 0; i < this.numQuestions; i++) {
      let randId = this.idsList[this.genRandNum(this.idsAmount)];
      //if the id has been seen loop again until unique id is made
      if (usedIds.includes(randId)) {
        i--;
        continue;
      }
      //add the capital and the answer to the question
      this.questions.push({
        capital: countryData[randId].capital,
        ISOCode: countryData[randId].code,
        answer: randId
      });
      usedIds.push(randId);
    }
  }

  genOptions() {
    //used to generated random alternative options
    for (let i = 0; i < this.numQuestions; i++) {
      let usedIds = [];
      usedIds.push(this.questions[i].answer);
      for (let j = 1; j < 4; j++) {
        let randId = this.idsList[this.genRandNum(this.idsAmount)];
        if (usedIds.includes(randId)) {
          j--;
          continue;
        }
        usedIds.push(randId);
      }
      this.questions[i].options = [];
      this.randArray(usedIds).forEach(id => {
        this.questions[i].options.push({ id, name: countryData[id].name });
      });
    }
  }

  getNameOfOption(val) {
    return this.getCurrentQuestion().options[val].name;
  }

  getQuestionData(questionType) {
    const question = this.getCurrentQuestion();
    return {
      correctAns: question.answer,
      data: questionType ? question.capital : question.ISOCode
    };
  }

  getCurrentQuestion() {
    return this.questions[this.questionIndex];
  }

  getCurrentQuestionRenderData() {
    return {
      question: this.getCurrentQuestion(),
      questionType: this.questionType
    };
  }

  getQuestionType(){
    return this.questionType;
  }

  getQuestionData() {
    const question = this.getCurrentQuestion();
    return this.questionType ? question.capital : question.ISOCode;
  }

  //used to scrabble the array so that the answer doesn't show up in the same position
  randArray(array) {
    let randArray = array;
    for (let i = 0; i < array.length; i++) {
      const randIndex = this.genRandNum(4);
      //remove and read add the number to the back
      let removeValue = randArray.splice(randIndex, 1)[0];
      randArray.push(removeValue);
    }
    return randArray;
  }

  isCorrect(userAnswer) {
    const currentQuestion = this.getCurrentQuestion();
    const correctAnswer = currentQuestion.answer;
    const userOption = currentQuestion.options[userAnswer].id;
    const correct = correctAnswer == userOption;
    //increment the question number
    console.log("the question index is", this.questionIndex);
    console.log(
      correctAnswer,
      userOption,
      this.questionIndex,
      userAnswer,
      correct
    );
    if (correct) {
      this.correctCount += 1;
    }
    return this.correctCount;
  }

  incrementQuestionCount() {
    this.questionIndex += 1;
  }

  getSeed() {
    return this.seed;
  }

  isGameOver() {
    return this.numQuestions == this.questionIndex;
  }

  genRandNum(max) {
    //generate random seeded number from from set parameter of max
    return Math.floor(this.seedRandom() * max);
  }
}
