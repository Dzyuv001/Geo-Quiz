import * as base from "./base";

export const showContainer = () => {
  base.flipUpContainer(base.elements.containerFeedback);
};

export const hideContainer = () => {
  base.flipOutContainer(base.elements.containerFeedback);
};

const renderShareDisplayContainer = () => {};

const renderScore = (numCorrect,numQuestions) =>{
  const percentCorrect = Math.round((numCorrect / numQuestions) * 100);
  const medal = base.elements.feedbackMedal;
  medal.innerHTML = `${numCorrect} of ${numQuestions}`;
  const medalType = ["wood","bronze","silver","gold","platinum"].map(w=>"medal__"+w);
  let medalIndex = 0;
  if (percentCorrect < 20) {
    base.elements.feedbackMessage.innerHTML = "Better luck next time";
  } else if (percentCorrect == 20 || percentCorrect < 50) {
    medalIndex = 1;
    base.elements.feedbackMessage.innerHTML = "Getting there";
  } else if (percentCorrect == 50 || percentCorrect < 90) {
    medalIndex=2;
    base.elements.feedbackMessage.innerHTML = "Good Work";
  } else if (percentCorrect == 90 || percentCorrect < 99) {
    medalIndex=3;
    base.elements.feedbackMessage.innerHTML = "Almost there, Well done";
  } else {
    medalIndex=4;
    base.elements.feedbackMessage.innerHTML = "Perfect, Excellent work";
  }
  medal.classList.remove(...medalType);
  medal.classList.add(medalType[medalIndex]);
}


const renderFeedbackTable = (questionType, questions) => {
  const stringQuestionType = questionType ? "Capital" : "Flag";
  base.elements.feedbackQuestionType.innerHTML = stringQuestionType;
  let htmlMarkup = "";
  questions.forEach(question => {
    htmlMarkup += renderRow(question, questionType);
  });
  base.elements.feedbackTableRows.innerHTML = htmlMarkup;
};

const renderRow = (question, questionType) => {
  let dataColumn = questionType
    ? question.data
    : `<img class="feedback__image" src="./assets/${question.data}.svg" alt="Flag of a country">`;
  const correct = `<td class="feedback__table-correct">${
    question.questionAnswer == question.userAnswer ? "✔" : "X"
  }</td>`;
  let markup = `
<tr class="table__row">
  ${correct}
  <td class="feedback__table-flag">${dataColumn}</td>
  <td class="feedback__table-correct-answer">${question.questionAnswer}</td>
  <td class="feedback__table-your-answer">${question.userAnswer}</td>

</tr>
`;
  return markup;
};

export const renderFeedback = feedback => {
  console.log("the feedback", feedback, feedback.numCorrect);
  renderScore(feedback.numCorrect,feedback.numQuestions);
  renderFeedbackTable(feedback.questionType, feedback.questions);
};
