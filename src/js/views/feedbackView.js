import * as base from "./base";

export const showContainer = () => {
  base.flipUpContainer(base.elements.containerFeedback);
};

export const hideContainer = () => {
  base.flipOutContainer(base.elements.containerFeedback);
};

export const renderShareDisplayContainer = () => {
    
}

export const renderFeedbackTable = () => {};

export const renderFeedback = () => {
  showContainer();
};
