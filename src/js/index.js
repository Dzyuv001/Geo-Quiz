import "../css/scss/main.scss";
import * as quizView from "./views/quizView";
import * as setupQuizView from "./views/quizSetupView";
import * as feedbackView from "./views/feedbackView";
import Quiz from "./models/quiz";
import Feedback from "./models/feedback";

import * as util from "./utility";

const controlSetupQuiz = questionType => {
  let queryString = "";
  queryString = util.getQueryString();
  console.log("we are here ", queryString);
  if (queryString == "") {
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
    queryString = {
      questionType,
      continentsMask: userOptions.continentsMask,
      seed
    };
    console.log("the data tha that is being passed is", queryString);
    util.setQueryString(queryString);
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
    console.log("debug data", correctIndex, option);
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
      console.log("the feedback data ", state.feedback.feedback);
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
  controlSetupQuiz();
});

document.getElementById("btnShare").addEventListener("click", e => {
  let copyError = copyPageURL();
  if (copyError){
    e.target.setAttribute("title","Failed to copy URL");
  }else {
    e.target.setAttribute("title","URL Copied");
  }
});

const copyPageURL = async () => {
  let hasError = false;
  //https://web.dev/image-support-for-async-clipboard/
  try {
    await navigator.clipboard.writeText(location.href);
    console.log('Page URL copied to clipboard');
    return false
  } catch (err) {
    console.error('Failed to copy: ', err);
    return true;
  }
}

document.getElementById("btnRetry").addEventListener("click", e => {
  //hide feedback quiz view
  const queryData = util.getQueryString();

  feedbackView.hideContainer();

  setupQuizView.showContainer();
  console.log("the data is being read from the thing ", queryData);
  controlSetupQuiz(queryData.questionType);
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
};

init(); //<-- entry point in the application
