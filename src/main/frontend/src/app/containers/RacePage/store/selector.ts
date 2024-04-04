import { createSelector } from "reselect";
import { IRootState } from "../../../types";

const selectRacePage = (state: IRootState) => state.racePage;

const makeSelectRacePage = createSelector(
    selectRacePage,
    (racePage) => racePage.page
);

export { makeSelectRacePage }