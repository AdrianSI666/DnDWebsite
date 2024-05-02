import { createSelector } from "reselect";
import { IRootState } from "../../../../types";

const selectWorldPage = (state: IRootState) => state.worldPage;

const makeSelectWorldPage = createSelector(
    selectWorldPage,
    (worldPage) => worldPage.page
);

export { makeSelectWorldPage }