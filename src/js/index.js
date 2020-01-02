import "../css/scss/main.scss";
import * as quizView from "./views/quizView";
import * as setupQuizView from "./views/quizSetupView";
import * as feedbackView from "./views/feedbackView";
import Quiz from "./models/quiz";
import Feedback from "./models/feedback";

import * as util from "./utility";

const controlSetupQuiz = (questionType, queryStringData) => {
  if (queryStringData) {
    const quizData = {
      questionType,
      seed: queryStringData.seed,
      numQuestions: queryStringData.numQuestions,
      continentsMask: queryStringData.continentsMask
    };
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

  //set up state to prevent user from mashing buttons to get through the quiz
  state.events.optionKeyEventPressable = true;
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

        //the time out is set based on avarage human raction time giving the user a time limit to read the question
        setTimeout(() => {
          //enable the use to
          state.events.optionKeyEventPressable = true;
        }, 250);
      }, 750);
    } else {
      //set quiz running to false to prevent keyup events from calling this function
      state.quiz.setQuizRunning(false);
      //hide quiz page
      quizView.hideContainer();
      //show the feedback page
      feedbackView.showContainer();
      //set correct amount
      state.feedback.setCorrectAnswers(state.quiz.getCorrectCount());
      //render feedback data
      feedbackView.renderFeedback(state.feedback.getFeedbackData());
    }
  }
};

//EVENTS

//start flag quiz button event
document.getElementById("btnStartFlagQuiz").addEventListener("click", e => {
  controlSetupQuiz(false);
});

//start capital quiz button event
document.getElementById("btnStartCapitalQuiz").addEventListener("click", e => {
  controlSetupQuiz(true);
});

//quit quiz button event
document.getElementById("btnQuitQuiz").addEventListener("click", e => {
  setupQuizView.showContainer();
  quizView.hideContainer();
});

//restart quiz during quiz button event
document.getElementById("btnRestart").addEventListener("click", e => {
  let queryStringData = util.getQueryString();
  controlSetupQuiz(queryStringData.questionType, queryStringData);
});

//share quiz button event
document.getElementById("btnShare").addEventListener("click", e => {
  let copyError = copyPageURL();
  if (copyError) {
    e.target.setAttribute("title", "Failed to copy URL");
  } else {
    e.target.setAttribute("title", "URL Copied");
  }
});

const copyPageURL = async () => {
  // function used to copy data from url sourced from link see below
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
  const queryData = util.getQueryString();

  //hide feedback quiz view
  feedbackView.hideContainer();
  //show quiz view
  quizView.showContainer();
  //pass data for the quiz to be generated
  controlSetupQuiz(queryData.questionType, queryData);
});

document.getElementById("btnCustomQuiz").addEventListener("click", e => {
  //hide feedback quiz view
  feedbackView.hideContainer();
  //show setup quiz view
  setupQuizView.showContainer();
});

//quiz option button press event
document.querySelector(".quiz__options").addEventListener("click", e => {
  if (e.target && e.target.className.includes("btnGeo")) {
    controlQuiz(e.target.getAttribute("data-value"));
  }
});

//number key press event
document.addEventListener("keyup", e => {
  if (state.quiz && state.quiz.getQuizRunning() && state.events.optionKeyEventPressable) {
    const keyOptions = [49, 50, 51, 52];
    const keyCodesToOptions = { "49": 0, "50": 1, "51": 2, "52": 3 };
    if (keyOptions.includes(e.keyCode)) {
      state.events.optionKeyEventPressable = false;
      controlQuiz(keyCodesToOptions[e.keyCode]);
    }
  }
});

//STARTING FUNCTION
const init = () => {
  let state = {};
  window.state = state;
  state.events = {};
  setupQuizView.showContainer();
  state.util = util;
  const queryStringData = util.getQueryString();
  if (Object.entries(queryStringData).length !== 0) {
    controlSetupQuiz(queryStringData.questionType, queryStringData);
  }
};

init(); //<-- entry point in the application
