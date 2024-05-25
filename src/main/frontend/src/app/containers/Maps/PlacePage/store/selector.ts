import { createSelector } from "reselect";
import { IRootState } from "../../../../types";


const selectPlacePage = (state: IRootState) => state.placePage;

const makeSelectPlacePage = createSelector(
    selectPlacePage,
    (placePage) => placePage.page
);

export { makeSelectPlacePage }