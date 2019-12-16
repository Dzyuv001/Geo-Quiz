import "../css/scss/main.scss";
import * as util from "./utility";
import * as quizView from "./views/quizView";
import * as setupQuizView from "./views/quizSetupView";
import Quiz from "./models/quiz";
import Feedback from "./views/feedbackView";

const controlSetupQuiz = questionType => {
  state.quiz.genQuestions(questionType);
  quizView.resetScoreboard(state.quiz.getQuestionNumber());
  quizView.renderQuizQuestion(state.quiz.getCurrentQuestion());
  setupQuizView.hideContainer();
  quizView.showContainer();
};

const controlQuiz = option => {
  if (!state.quiz.isGameOver()) {
    quizView.updateScoreboard(state.quiz.isCorrect(option));
    //update UI to show correct and incorrect
    quizView.toggleOptionBtns(true);
    //time out to display
    const val =state.quiz.getCorrectIndex();
    quizView.showCorrect(val);
    setTimeout(() => {
      //stop displaying correct and incorrect
      quizView.toggleOptionBtns(false);
      //update question
      quizView.renderQuizQuestion(state.quiz.getCurrentQuestion());

    }, 750);
  } else {
    // let feedback = state.quiz.getFeedback();
  }
};

//events
document.getElementById("btnStartFlagQuiz").addEventListener("click", e => {
  controlSetupQuiz(false);
});

document.querySelector(".quiz__options").addEventListener("click", e => {
  if (e.target && e.target.className.includes("btnGeo")) {
    controlQuiz(e.target.getAttribute("data-value"));
  }
});

const init = () => {
  let state = {};
  window.state = state;
  state.quiz = new Quiz();
  setupQuizView.showContainer();
};

init();