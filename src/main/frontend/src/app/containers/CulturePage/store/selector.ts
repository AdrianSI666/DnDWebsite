import { createSelector } from "reselect";
import { IRootState } from "../../../types";

const selectCulturePage = (state: IRootState) => state.culturePage;

const makeSelectCulturePage = createSelector(
    selectCulturePage,
    (culturePage) => culturePage.page
);

export { makeSelectCulturePage }