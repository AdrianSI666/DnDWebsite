import { createSelector } from "reselect";
import { IRootState } from "../../../../types";

const selectOneCulture = (state: IRootState) => state.oneCulture;

const makeSelectOneCulture = createSelector(
    selectOneCulture,
    (cultureState) => cultureState.culture
);

export { makeSelectOneCulture }