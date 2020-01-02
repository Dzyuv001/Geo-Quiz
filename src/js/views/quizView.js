import * as base from "./base";

//used to hide the view
export const showContainer = () => {
  base.flipUpContainer(base.elements.containerQuiz);
};

//used to hide the view
export const hideContainer = () => {
  base.flipOutContainer(base.elements.containerQuiz);
};

//used to set the total number of questions
export const resetScoreboard = totalValue => {
  base.elements.quizTotal.innerHTML = totalValue;
  updateScoreboard(0);
};

////update the scoreboard to show the amount of correct answers the user has made
export const updateScoreboard = currentScore => {
  base.elements.quizCorrect.innerHTML = currentScore;
};

//used to show what answer was correct by making the btn green and the rest red
export const showCorrect = correctIndex => {
  base.elements.quizOptionBtn.forEach((btn, i) => {
    btn.classList.add(
      correctIndex == i ? "btnGeo--correct" : "btnGeo--incorrect"
    );
  });
};

//used to enable or disable btn to allow the user select options when the quiz game is ready
export const toggleOptionBtns = isDisabled => {
  //loop through all the option buttons
  base.elements.quizOptionBtn.forEach(btn => {
    //see button to disabled or enabled based on the isDisabled value
    btn.disabled = isDisabled;
  });
};

//used to render the question
export const renderQuestion = questionData => {
  let htmlMarkup = "";
  if (questionData.questionType) {
    htmlMarkup = `
<h2 class="heading-2 quiz__text">What country has the capital called <strong>${questionData.question.capital}?</strong></h2>`;
  } else {
    htmlMarkup = `
<h2 class="heading-2 quiz__text">What countries flag is this?</h2>
<img class="quiz__flag-image" src="./assets/${questionData.question.ISOCode}.svg" alt="Flag of a country">`;
  }
  return htmlMarkup;
};

//render the multiple choices to answer the question
export const renderOptions = options => {
  base.elements.quizOptionBtn.forEach((btn, i) => {
    btn.innerHTML = options[i].name;
    btn.classList.remove("btnGeo--correct");
    btn.classList.remove("btnGeo--incorrect");
  });
};

//render current quiz question to allow the user to answer it
export const renderQuizQuestion = questionData => {
  base.elements.quizQuestionContainer.innerHTML = renderQuestion(questionData);
  renderOptions(questionData.question.options);
};
