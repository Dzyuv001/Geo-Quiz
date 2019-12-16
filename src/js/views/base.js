export const elements = {
  containerMain: document.querySelector(".container.main"),
  containerQuiz: document.querySelector(".container.quiz"),
  startFlagQuiz: document.getElementById("btnStartFlagQuiz"),
  startCapitalQuiz: document.getElementById("btnStartCapitalQuiz"),
  startCustomFlagQuiz: document.getElementById("btnStartCustomFlagQuiz"),
  startCustomCapitalQuiz: document.getElementById("btnStartCustomCapitalQuiz"),
  quizTotal: document.querySelector(".quiz_total"),
  quizCorrect: document.querySelector(".quiz__correct"),
  quizQuestionContainer: document.querySelector(".quiz__question"),
  quizOptions: document.querySelector("quiz__options"),
  quizOptionBtn: document.querySelectorAll(".btnGeo")
};

export const classStrings = {
  containerVisible: "container--visible",
  containerInvisible: "container--invisible"
};

export const flipUpContainer = container => {
  if (container) {
    container.classList.add(classStrings.containerVisible);
    container.classList.remove(classStrings.containerInvisible);
  }
};

export const flipOutContainer = container => {
  if (container) {
    container.classList.add(classStrings.containerInvisible);
    container.classList.remove(classStrings.containerVisible);
  }
};
