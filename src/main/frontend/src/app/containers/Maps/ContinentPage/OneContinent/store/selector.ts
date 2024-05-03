import { createSelector } from "reselect";
import { IRootState } from "../../../../../types";


const selectOneContinent = (state: IRootState) => state.oneContinent;

const makeSelectOneContinent = createSelector(
    selectOneContinent,
    (placeDTO) => placeDTO.continent
);

export { makeSelectOneContinent }