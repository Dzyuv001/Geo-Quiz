var seedrandom = require("seedrandom");
import countryData from "../JSON/CountryData.json";
import continentIds from "../JSON/ContinentId.json";
// import countryISOCodes from "../JSON/CountryCode.json";
export default class Quiz {
  constructor(queryString) {
    // check if query string is null
    if (queryString) {
      this.seed = queryString.seed;
      this.questionAmount = queryString.questionNum;
      this.getIdsList();
    } else {
      this.seed = (Math.random() + "").split(".")[1];
    }
    // this.TotalQuestions = totalQuestion;
    this.correctCount = 0;
    this.questionNumber = 0;
    this.seedRandom = seedrandom(this.seed);
    this.questionAmount = 10;
    this.idsList = this.getIdsList("");
    this.idsAmount = this.idsList.length - 1;
    this.questions = [];
    this.questionType;
  }

  getCorrectIndex() {
    const question = this.questions[this.questionNumber - 1];
    let id;
    for (let i = 0; i < question.options.length; i++) {
      if (question.options[i].id == question.answer) {
        id = i;
        break;
      }
    }
    return id;
  }

  getQuestionNumber() {
    return this.questionAmount;
  }

  getIdsList(continentMask) {
    let ids = [];
    continentIds.forEach((continentArray, i) => {
      if (
        continentMask == "" ||
        continentMask == "0000000" ||
        continentMask[i]
      ) {
        ids.push(...continentArray);
      }
    });
    return ids;
  }

  genQuestions(questionType) {
    this.questionAmount = 10;
    this.idsList = this.getIdsList("");
    this.idsAmount = this.idsList.length - 1;
    this.questionType = questionType;
    this.genQuestionNAnswers();
    this.genOptions();
    console.log(this.questions);
  }

  genQuestionNAnswers() {
    //if true flag question if false capital question
    let usedIds = [];
    for (let i = 0; i < this.questionAmount; i++) {
      let randNum = this.genRandNum(this.idsAmount);
      //if the id has been seen loop again until unique id is made
      if (usedIds.includes(randNum)) {
        i--;
        continue;
      }
      //add the capital and the answer to the question
      this.questions.push({
        capital: countryData[randNum].capital,
        ISOCode: countryData[randNum].code,
        answer: randNum
      });
      usedIds.push(randNum);
    }
  }

  genOptions() {
    //used to generated random alternative options
    for (let i = 0; i < this.questionAmount; i++) {
      let usedIds = [];
      usedIds.push(this.questions[i].answer);
      for (let j = 1; j < 4; j++) {
        let randNum = this.genRandNum(this.idsAmount);
        if (usedIds.includes(randNum)) {
          j--;
          continue;
        }
        usedIds.push(randNum);
      }
      this.questions[i].options = [];
      this.randArray(usedIds).forEach(id => {
        this.questions[i].options.push({ id, name: countryData[id].name });
      });
    }
  }

  getCurrentQuestion() {
    return {
      question: this.questions[this.questionNumber],
      questionType: this.questionType
    };
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
    console.log(userAnswer - 1);
    const currentQuestion = this.questions[this.questionNumber];
    const correctAnswer = currentQuestion.answer;
    const userOption = currentQuestion.options[userAnswer - 1].id;
    const correct = correctAnswer == userOption;
    // this.feedback.push({
    //   correct,
    //   correctAnswer,
    //   userAnswer
    // });
    //increment the question number
    this.questionNumber += 1;
    console.log(
      correctAnswer,
      userOption,
      this.questionNumber,
      userAnswer,
      correct
    );
    if (correct) {
      this.correctCount += 1;
    }
    return this.correctCount;
  }

  isGameOver() {
    return this.questionAmount == this.questionNumber;
  }
  genRandNum(max) {
    //generate random seeded number from from set parameter of max
    return Math.floor(this.seedRandom() * max);
  }
}
