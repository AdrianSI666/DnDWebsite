import { createSelector } from "reselect";
import { IRootState } from "../../../../types";


const selectKingdomPage = (state: IRootState) => state.kingdomPage;

const makeSelectKingdomPage = createSelector(
    selectKingdomPage,
    (placePage) => placePage.page
);

export { makeSelectKingdomPage }