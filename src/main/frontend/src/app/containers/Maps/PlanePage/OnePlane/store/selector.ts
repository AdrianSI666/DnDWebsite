import { createSelector } from "reselect";
import { IRootState } from "../../../../../types";


const selectOnePlane = (state: IRootState) => state.onePlane;

const makeSelectOnePlane = createSelector(
    selectOnePlane,
    (placeDTO) => placeDTO.plane
);

export { makeSelectOnePlane }