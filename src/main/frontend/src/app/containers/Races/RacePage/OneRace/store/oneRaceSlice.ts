import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../../services/openapi";
import { IOneRaceState } from "../../types";

const initialState: IOneRaceState = {
    race: {
        race: {

        },
        regions: new Array<EntryDTO>(),
        subRaces: new Array<EntryDTO>(),
        images: new Array<ImageDTO>()
    }
}

const OneRaceSlice = createSlice({
    name: "oneRace",
    initialState,
    reducers: {
        setRace(state, action: PayloadAction<EntryFullDTO>) {
            state.race = action.payload;
        },
        updateRace(state, action: PayloadAction<EntryDTO>) {
            state.race.race = action.payload;
        },
        addImageToRace(state, action: PayloadAction<ImageDTO>) {
            state.race.images?.push(action.payload);
        },
        removeImageFromRace(state, action: PayloadAction<number>) {
            state.race.images = state.race.images?.filter((image) => image.id !== action.payload);
        },
        addNewSubRaceToRace(state, action: PayloadAction<EntryDTO>) {
            state.race.subRaces?.push(action.payload);
        },
        removeSubRaceFromRace(state, action: PayloadAction<number>) {
            state.race.subRaces = state.race.subRaces?.filter((subRace) => subRace.id !== action.payload);
        },
        addNewRegionToRace(state, action: PayloadAction<EntryDTO>) {
            state.race.regions?.push(action.payload);
        },
        removeRegionFromRace(state, action: PayloadAction<number>) {
            state.race.regions = state.race.regions?.filter((region) => region.id !== action.payload);
        },
    }
}
)

export const { setRace, updateRace, addImageToRace, removeImageFromRace, addNewSubRaceToRace, removeSubRaceFromRace, addNewRegionToRace, removeRegionFromRace } = OneRaceSlice.actions;
export default OneRaceSlice.reducer;