import { createSelector } from "reselect";
import { IRootState } from "../../../../types";

const selectOneBeast = (state: IRootState) => state.oneBeast;

const makeSelectOneBeast = createSelector(
    selectOneBeast,
    (beastState) => beastState.beast
);

export { makeSelectOneBeast }