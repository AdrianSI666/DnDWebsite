import { createSelector } from "reselect";
import { IRootState } from "../../../../../types";

const selectOneSubRace = (state: IRootState) => state.oneSubRace;

const makeSelectOneSubRace = createSelector(
    selectOneSubRace,
    (subRaceState) => subRaceState.subRace
);

export { makeSelectOneSubRace }