import * as base from "./base";

//used to hide the view
export const showContainer = () => {
  base.flipUpContainer(base.elements.containerMain);
};

//used to hide the view
export const hideContainer = () => {
  base.flipOutContainer(base.elements.containerMain);
};

//get user input for the quiz
export const getInput = () => {
  let input = {};
  input.numQuestions = base.elements.quizOptionsSelect.value;
  input.continentsMask = "";
  base.elements.quizOptionsChkArray.forEach(e => {
    input.continentsMask += e.checked ? "1" : "0";
  });
  return input;
};
