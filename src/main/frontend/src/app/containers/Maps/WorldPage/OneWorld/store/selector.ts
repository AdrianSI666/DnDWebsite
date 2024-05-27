import { createSelector } from "reselect";
import { IRootState } from "../../../../../types";

const selectOneWorld = (state: IRootState) => state.oneWorld;

const makeSelectOneWorld = createSelector(
    selectOneWorld,
    (worldState) => worldState.world
);

export { makeSelectOneWorld }