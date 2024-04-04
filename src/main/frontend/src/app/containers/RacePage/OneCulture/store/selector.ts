import { createSelector } from "reselect";
import { IRootState } from "../../../../types";

const selectOneRace = (state: IRootState) => state.oneRace;

const makeSelectOneRace = createSelector(
    selectOneRace,
    (raceState) => raceState.race
);

export { makeSelectOneRace }