import * as base from "./base";

export const showContainer = () => {
  base.flipUpContainer(base.elements.containerQuiz);
};

export const hideContainer = () => {
  base.flipOutContainer(base.elements.containerQuiz);
};

export const resetScoreboard = totalValue => {
  base.elements.quizTotal.innerHTML = totalValue;
  updateScoreboard(0);
};

export const updateScoreboard = currentScore => {
  base.elements.quizCorrect.innerHTML = currentScore;
};

export const showCorrect = correctIndex => {
  base.elements.quizOptionBtn.forEach((btn, i) => {
    btn.classList.add(
      correctIndex == i ? "btnGeo--correct" : "btnGeo--incorrect"
    );
  });
};

export const toggleOptionBtns = isDisabled => {
  //loop through all the option buttons
  base.elements.quizOptionBtn.forEach((btn, i) => {
    //see button to disabled or enabled based on the isDisabled value
    btn.disabled = isDisabled;
  });
};

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
export const renderOptions = options => {
  base.elements.quizOptionBtn.forEach((btn, i) => {
    btn.innerHTML = options[i].name;
    btn.classList.remove("btnGeo--correct");    
    btn.classList.remove("btnGeo--incorrect");
  });
};
export const renderQuizQuestion = questionData => {
  //question
  base.elements.quizQuestionContainer.innerHTML = renderQuestion(questionData);
  renderOptions(questionData.question.options);
};
