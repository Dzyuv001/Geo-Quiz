import * as base from "./base";

export const showContainer = () => {
  base.flipUpContainer(base.elements.containerMain);
};

export const hideContainer = () => {
  base.flipOutContainer(base.elements.containerMain);
};