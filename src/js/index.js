import "../css/scss/main.scss";
import * as quizView from "./views/quizView";
import * as setupQuizView from "./views/quizSetupView";
import * as feedbackView from "./views/feedbackView";
import Quiz from "./models/quiz";
import Feedback from "./models/feedback";

import * as util from "./utility";

const controlSetupQuiz = (questionType, queryStringData) => {
  if (queryStringData) {
    console.log("queryStringData:", queryStringData);
    const quizData = {
      questionType,
      seed: queryStringData.seed,
      numQuestions: queryStringData.numQuestions,
      continentsMask: queryStringData.continentsMask
    };
    console.log("the data is now");
    state.quiz = new Quiz(quizData);
    state.feedback = new Feedback(quizData);
  } else {
    const userOptions = setupQuizView.getInput();
    let seed;
    state.quiz = new Quiz({
      numQuestions: userOptions.numQuestions,
      continentsMask: userOptions.continentsMask
    });
    seed = state.quiz.getSeed();
    const quizData = {
      questionType,
      seed,
      numQuestions: userOptions.numQuestions,
      continentsMask: userOptions.continentsMask
    };
    state.feedback = new Feedback(quizData);
    util.setQueryString(quizData);
  }
  console.log("the question type of the quiz", questionType);
  state.quiz.genQuestions(questionType);
  quizView.resetScoreboard(state.quiz.getNumQuestions());
  quizView.renderQuizQuestion(state.quiz.getCurrentQuestionRenderData());
  setupQuizView.hideContainer();
  quizView.showContainer();
  quizView.toggleOptionBtns(false);
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
  let queryStringData = util.getQueryString();
  controlSetupQuiz(queryStringData.questionType, queryStringData);
});

document.getElementById("btnShare").addEventListener("click", e => {
  let copyError = copyPageURL();
  if (copyError) {
    e.target.setAttribute("title", "Failed to copy URL");
  } else {
    e.target.setAttribute("title", "URL Copied");
  }
});

const copyPageURL = async () => {
  //https://web.dev/image-support-for-async-clipboard/
  try {
    await navigator.clipboard.writeText(location.href);
    console.log("Page URL copied to clipboard");
    return false;
  } catch (err) {
    console.error("Failed to copy: ", err);
    return true;
  }
};

document.getElementById("btnRetry").addEventListener("click", e => {
  //hide feedback quiz view
  const queryData = util.getQueryString();

  feedbackView.hideContainer();
  console.log("the query string data", queryData);
  quizView.showContainer();
  controlSetupQuiz(queryData.questionType, queryData);
});

document.getElementById("btnCustomQuiz").addEventListener("click", e => {
  //hide feedback quiz view
  feedbackView.hideContainer();
  //show setup quiz view
  setupQuizView.showContainer();
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
  state.util = util;
  const queryStringData = util.getQueryString();
  if (Object.entries(queryStringData).length !== 0) {
    controlSetupQuiz(queryStringData.questionType, queryStringData);
  } else {

  }
};

init(); //<-- entry point in the application
