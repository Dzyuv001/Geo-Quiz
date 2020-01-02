export default class Feedback {
  constructor(feedback) {
    this.questionType = feedback.questionType;
    this.numQuestions = feedback.numQuestions;
    this.numCorrect = 0;
    this.seed = feedback.seed;
    this.continentsMask = feedback.continentsMask;
    this.questions = [];
  }

  //add question to the feedback section
  addQuestionFeedback(questionAnswer, userAnswer, data) {
    this.questions.push({
      questionAnswer,
      userAnswer,
      data
    });
  }

  //used to set the amount of questions answered correctly
  setCorrectAnswers(numCorrect) {
    this.numCorrect = numCorrect;
  }

  // set tje feedback object
  getFeedbackData() {
    return this;
  }
}
