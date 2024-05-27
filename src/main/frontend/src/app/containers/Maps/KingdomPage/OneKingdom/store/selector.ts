import { createSelector } from "reselect";
import { IRootState } from "../../../../../types";


const selectOneKingdom = (state: IRootState) => state.oneKingdom;

const makeSelectOneKingdom = createSelector(
    selectOneKingdom,
    (placeDTO) => placeDTO.kingdom
);

export { makeSelectOneKingdom }