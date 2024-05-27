import { createSelector } from "reselect";
import { IRootState } from "../../../../../types";


const selectOneRegion = (state: IRootState) => state.oneRegion;

const makeSelectOneRegion = createSelector(
    selectOneRegion,
    (placeDTO) => placeDTO.region
);

export { makeSelectOneRegion }