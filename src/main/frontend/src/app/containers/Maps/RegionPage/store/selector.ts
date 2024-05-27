import { createSelector } from "reselect";
import { IRootState } from "../../../../types";


const selectRegionPage = (state: IRootState) => state.regionPage;

const makeSelectRegionPage = createSelector(
    selectRegionPage,
    (placePage) => placePage.page
);

export { makeSelectRegionPage }