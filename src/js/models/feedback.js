export default class Feedback {
  constructor(feedback) {
    this.feedback = {
      questionType: feedback.questionType,
      numQuestions: feedback.numQuestions,
      numCorrect:0,
      seed: feedback.seed,
      continentsMask: feedback.continentsMask,
      questions: []
    };
  }

  addQuestionFeedback(questionAnswer, userAnswer, data) {
    this.feedback.questions.push({
      questionAnswer,
      userAnswer,
      data
    });
  }

  setCorrectAnswers(numCorrect){
      this.feedback.numCorrect = numCorrect;
  }

  getFeedBackData() {
      return this.feedback;
  }
}
