import "../css/scss/main.scss";
import * as quizView from "./views/quizView";
import * as setupQuizView from "./views/quizSetupView";
import * as feedbackView from "./views/feedbackView";
import Quiz from "./models/quiz";
import Feedback from "./models/feedback";

const controlSetupQuiz = questionType => {
  const queryString = "";
  if (queryString) {
    state.quiz = new Quiz({
      questionType,
      seed: queryString.seed,
      numQuestions: queryString.numQuestions,
      continentsMask: queryString.continentsMask
    });
    state.feedback = new Feedback({
      questionType,
      seed: queryString.seed,
      numQuestions: queryString.numQuestions,
      continentsMask: queryString.continentsMask
    });
  } else {
    const userOptions = setupQuizView.getInput();
    console.log("the user input values", userOptions);
    let seed;
    state.quiz = new Quiz({
      numQuestions: userOptions.numQuestions,
      continentsMask: userOptions.continentsMask
    });
    seed = state.quiz.getSeed();
    state.feedback = new Feedback({
      questionType,
      seed,
      numQuestions: userOptions.numQuestions,
      continentsMask: userOptions.continentsMask
    });
  }
  state.quiz.genQuestions(questionType);
  quizView.resetScoreboard(state.quiz.getNumQuestions());
  quizView.renderQuizQuestion(state.quiz.getCurrentQuestionRenderData());
  setupQuizView.hideContainer();
  quizView.showContainer();
};

const controlQuiz = option => {
  if (!state.quiz.isGameOver()) {
    //check if the user is correct and return correct count
    const correctCount = state.quiz.isCorrect(option);
    //update scoreboard
    quizView.updateScoreboard(correctCount);
    //update UI to show correct and incorrect
    quizView.toggleOptionBtns(true);
    //get Index of correct answer
    const correctIndex = state.quiz.getCorrectIndex();
    //show correct and incorrect answers

    //gather data for feedback obj
    const correctAns = state.quiz.getNameOfOption(correctIndex);
    const userAns = state.quiz.getNameOfOption(option);
    const data = state.quiz.getQuestionData();

    //set the current question data to the feedback obj
    state.feedback.addQuestionFeedback(correctAns, userAns, data);

    //display correct and incorrect answer to the questions
    quizView.showCorrect(correctIndex);

    //increment the question
    state.quiz.incrementQuestionCount();

    // check if the game is over
    if (!state.quiz.isGameOver()) {
      //time out to allows the user to see incorrect and correct answers
      setTimeout(() => {
        //stop displaying correct and incorrect
        quizView.toggleOptionBtns(false);
        //render next question
        quizView.renderQuizQuestion(state.quiz.getCurrentQuestionRenderData());
      }, 750);
    } else {
      //hide quiz page
      quizView.hideContainer();
      //show the feedback page
      feedbackView.showContainer();
      //set correct amount
      state.feedback.setCorrectAnswers(state.quiz.getCorrectCount());
      //render feedback data
      feedbackView.renderFeedback(state.feedback.feedback);
    }
  }
};

const controlFeedback = quizOver => {
  if (quizOver) {
  } else {
  }
};

//events
document.getElementById("btnStartFlagQuiz").addEventListener("click", e => {
  controlSetupQuiz(false);
});

document.getElementById("btnStartCapitalQuiz").addEventListener("click", e => {
  controlSetupQuiz(true);
});

document.getElementById("btnQuitQuiz").addEventListener("click", e => {
  setupQuizView.showContainer();
  quizView.hideContainer();
});

document.getElementById("btnRestart").addEventListener("click", e => {
  controlSetupQuiz();
});

document.querySelector(".quiz__options").addEventListener("click", e => {
  if (e.target && e.target.className.includes("btnGeo")) {
    controlQuiz(e.target.getAttribute("data-value"));
  }
});

const init = () => {
  let state = {};
  window.state = state;
  setupQuizView.showContainer();
};

init(); //<-- entry point in the application
