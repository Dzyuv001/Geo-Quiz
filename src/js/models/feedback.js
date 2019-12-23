export default class Feedback {
  constructor(feedback) {
    this.feedback = {
      questionType: feedback.questionType,
      numCorrect:"",
      numQuestions: feedback.numQuestions,
      seed: feedback.seed,
      continentsMask: feedback.continentsMask,
      questions: []
    };
  }

  addQuestionFeedback(questionAnswer, userAnswer, data) {
    console.log("the data",questionAnswer, userAnswer, data)
    this.feedback.questions.push({
      questionAnswer,
      userAnswer,
      data
    });
  }

  setCorrectAnswers(numOfCorrectAns){
      this.feedback.numOfCorrectAns = numOfCorrectAns;
  }

  getFeedBackData() {
      return this.feedback;
  }
}
