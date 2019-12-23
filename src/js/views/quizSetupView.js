import * as base from "./base";

export const showContainer = () => {
  base.flipUpContainer(base.elements.containerMain);
};

export const hideContainer = () => {
  base.flipOutContainer(base.elements.containerMain);
};

export const getInput = () => {
  let input = {};
  input.numQuestions = base.elements.quizOptionsSelect.value;
  input.continentsMask = "";
  base.elements.quizOptionsChkArray.forEach(e => {
    input.continentsMask += e.checked ? "1" : "0";
  });
  console.log("the user value of the input value",input );
  return input;
};
