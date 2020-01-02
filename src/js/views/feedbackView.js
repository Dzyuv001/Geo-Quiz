import * as base from "./base";

//used to hide the view
export const showContainer = () => {
  base.flipUpContainer(base.elements.containerFeedback);
};

//used to hide the view
export const hideContainer = () => {
  base.flipOutContainer(base.elements.containerFeedback);
};

//used to set the render the message and the medal
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

//used to render the table that will display a table showing what the user selected during their quiz
const renderFeedbackTable = (questionType, questions) => {
  const stringQuestionType = questionType ? "Capital" : "Flag";
  base.elements.feedbackQuestionType.innerHTML = stringQuestionType;
  let htmlMarkup = "";
  questions.forEach(question => {
    htmlMarkup += renderRow(question, questionType);
  });
  base.elements.feedbackTableRows.innerHTML = htmlMarkup;
};

//used to render individual rows (created for readability )
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

//main render method to simplify access the feedback view
export const renderFeedback = feedback => {
  renderScore(feedback.numCorrect,feedback.numQuestions);
  renderFeedbackTable(feedback.questionType, feedback.questions);
};
