import { USER_STATE } from "./phone.types";

const numberList = [1, 2, 3, 4, 5, 6, 7, 8, 9, "+", 0, "<<"];

const stateColor = {
  [USER_STATE.CONNECTING]: "#B7AC44",
  [USER_STATE.READY]: "#DAD870",
  [USER_STATE.INCOMING]: "#7A871E",
  [USER_STATE.ON_CALL]: "#FF5C4D",
  [USER_STATE.OFFLINE]: "#FFB52E",
};
export { numberList, stateColor };
