import { createSelector } from "reselect";
import { IRootState } from "../../../../types";


const selectContinentPage = (state: IRootState) => state.continentPage;

const makeSelectContinentPage = createSelector(
    selectContinentPage,
    (placePage) => placePage.page
);

export { makeSelectContinentPage }