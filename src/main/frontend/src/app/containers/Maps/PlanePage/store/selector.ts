import { createSelector } from "reselect";
import { IRootState } from "../../../../types";


const selectPlanePage = (state: IRootState) => state.planePage;

const makeSelectPlanePage = createSelector(
    selectPlanePage,
    (placePage) => placePage.page
);

export { makeSelectPlanePage }