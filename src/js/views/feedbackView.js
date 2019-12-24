import * as base from "./base";

export const showContainer = () => {
  base.flipUpContainer(base.elements.containerFeedback);
};

export const hideContainer = () => {
  base.flipOutContainer(base.elements.containerFeedback);
};

const renderShareDisplayContainer = (
  questionType,
  numCorrect,
  numQuestions
) => {
  const stringQuizType = questionType ? "Capital" : "Flag";
  base.elements.feedbackQuizType.innerHTML = stringQuizType;
  base.elements.feedbackScore.innerHTML = `${numCorrect} of ${numQuestions}`;
  const percentCorrect = Math.round((numCorrect / numQuestions) * 100);
  if (percentCorrect < 20) {
    base.elements.feedbackMessage.innerHTML = "Better luck next time";
  } else if (percentCorrect == 20 || percentCorrect < 50) {
    base.elements.feedbackMessage.innerHTML = "Getting there";
  } else if (percentCorrect == 50 || percentCorrect < 90) {
    base.elements.feedbackMessage.innerHTML = "Good Work";
  } else if (percentCorrect == 90 || percentCorrect < 99) {
    base.elements.feedbackMessage.innerHTML = "Almost there, Well done";
  } else {
    base.elements.feedbackMessage.innerHTML = "Perfect, Excellent work";
  }
};
const renderFeedbackTable = (questionType, questions) => {
  const stringQuestionType = questionType ? "Capital" : "Flag";
  base.elements.feedbackQuestionType.innerHTML = stringQuizType;
  let htmlMarkup = "";
  question.forEach(question => {
    htmlMarkup += renderRow(question, questionType);
  });
  feedbackTableRows.innerHTML = htmlMarkup;
};

const renderRow = (question, questionType) => {
  let dataColumn = questionType
    ? question.data
    : `<img class="quiz__flag-image" src="./assets/${question.data}.svg" alt="Flag of a country">`;
  let markup = `
<td>
 ${dataColumn}
</td>
<td>${question.questionAnswer}</td>
<td>${question.userAnswer}</td>
`;
  return markup;
};

export const renderFeedback = feedback => {
  renderShareDisplayContainer(
    feedback.questionType,
    feedback.numCorrect,
    numQuestions
  );
  renderFeedbackTable();
  console.log(feedback);
};
