import { createSelector } from "reselect";
import { IRootState } from "../../../../../types";


const selectOnePlace = (state: IRootState) => state.onePlace;

const makeSelectOnePlace = createSelector(
    selectOnePlace,
    (placeDTO) => placeDTO.place
);

export { makeSelectOnePlace }