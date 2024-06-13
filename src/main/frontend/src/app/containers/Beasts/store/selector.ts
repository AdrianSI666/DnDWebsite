import { createSelector } from "reselect";
import { IRootState } from "../../../types";

const selectBeastPage = (state: IRootState) => state.beastPage;

const makeSelectBeastPage = createSelector(
    selectBeastPage,
    (beastPage) => beastPage.page
);

export { makeSelectBeastPage }