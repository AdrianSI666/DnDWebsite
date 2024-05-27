import { createSelector } from "reselect";
import { IRootState } from "../../../../types";

const selectSubRacePage = (state: IRootState) => state.subRacePage;

const makeSelectSubRacePage = createSelector(
    selectSubRacePage,
    (subRacePage) => subRacePage.page
);

export { makeSelectSubRacePage }