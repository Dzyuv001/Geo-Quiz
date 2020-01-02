var seedRandom = require("seedrandom");
import countryData from "../JSON/CountryData.json";
import continentIds from "../JSON/ContinentId.json";

export default class Quiz {
  constructor(quizData) {
    // check if there is random seed
    if (quizData.seed) {
      this.seed = quizData.seed;
    } else {
      this.seed = (Math.random() + "").split(".")[1];
    }
    this.numQuestions = quizData.numQuestions;
    this.seedRandom = seedRandom(this.seed);
    this.resetQuiz();
    this.idsList = this.getIdsList(quizData.continentsMask);
    this.idsAmount = this.idsList.length - 1;
    this.questions = [];
    this.questionType;
    this.isQuizRunning = false;
  }

  genQuestions(questionType) {
    this.questionType = questionType;
    this.genQuestionNAnswers();
    this.genOptions();
    this.setQuizRunning(true);
  }

  genQuestionNAnswers() {
    //if true flag question if false capital question
    let usedIds = [];
    for (let i = 0; i < this.numQuestions; i++) {
      let randId = this.idsList[this.genRandNum(this.idsAmount)];
      // //if the id has been seen loop again until unique id is made
      // if (usedIds.includes(randId)) {
      //   i--;
      //   continue;
      // }
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

 //generate the list of ids based on the ids mask provided
 getIdsList(continentMask) {
  let ids = [];
  continentIds.forEach((continentArray, i) => {
    if (continentMask == "0000000" || continentMask[i] == "1") {
      ids.push(...continentArray);
    }
  });
  return ids;
}

//used to partially reset the quiz , resetting the current question index and the number of correctly answered questions
  resetQuiz() {
    this.correctCount = 0;
    this.questionIndex = 0; //current question number
  }

  isPlayable() {
    return this.idsAmount + 1 >= this.numQuestions;
  }

  isGameOver() {
    return this.numQuestions == this.questionIndex;
  }

  //compare the user answer to the correct answer
  isCorrect(userAnswer) {
    const currentQuestion = this.getCurrentQuestion();
    const correctAnswer = currentQuestion.answer;
    const userOption = currentQuestion.options[userAnswer].id;
    const correct = correctAnswer == userOption;
    if (correct) {
      this.correctCount += 1;
    }
    return this.correctCount;
  }

  //get the amount of correct answers
  getCorrectCount() {
    return this.correctCount;
  }

  //get the name of the options that was passed in
  //the use case is to get the names for user selection and the correct selection, used for feedback screen
  getNameOfOption(val) {
    return this.getCurrentQuestion().options[val].name;
  }

//set the state of the quiz
  setQuizRunning(running) {
    this.isQuizRunning = running;
  }

  //get the quiz running state of the quiz
  getQuizRunning() {
    return this.isQuizRunning;
  }

  getQuestionIndex() {
    return this.questionIndex;
  }

  
//get the index of the correct answer
//used to highligh the correct answer to show to the user if they are correct
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

  //get question number
  getNumQuestions() {
    return this.numQuestions;
  }

//get question data to be stored for feedback purposes
  getQuestionData(questionType) {
    const question = this.getCurrentQuestion();
    return {
      correctAns: question.answer,
      data: questionType ? question.capital : question.ISOCode
    };
  }

//used to get the current question 
  getCurrentQuestion() {
    return this.questions[this.questionIndex];
  }

  //get the current question and the type of question that is being run
  getCurrentQuestionRenderData() {
    return {
      question: this.getCurrentQuestion(),
      questionType: this.questionType
    };
  }


  // //get current question type
  // getQuestionType() {
  //   return this.questionType;
  // }

  //used to get ether the flag code of the capital name based on selected question type
  getQuestionData() {
    const question = this.getCurrentQuestion();
    return this.questionType ? question.capital : question.ISOCode;
  }

  //used to scrabble the array so that the answer doesn't show up in the same position
  randArray(array) {
    return array.sort(() => this.seedRandom() - 0.5);
  }

//used to increment the question number so that the next question may be loaded
  incrementQuestionCount() {
    this.questionIndex += 1;
  }

  //used to get the seed of the question
  getSeed() {
    return this.seed;
  }

  //generate random number based on the seeded randomization enabled by seedRandom package
  genRandNum(max) {
    //generate random seeded number from from set parameter of max
    return Math.floor(this.seedRandom() * max);
  }
}
