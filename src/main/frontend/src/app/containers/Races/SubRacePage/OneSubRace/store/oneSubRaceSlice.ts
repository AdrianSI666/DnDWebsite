import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../../services/openapi";
import { IOneSubRaceState } from "../../types";

const initialState: IOneSubRaceState = {
    subRace: {
        subRace: {

        },
        regions: new Array<EntryDTO>(),
        race: {},
        images: new Array<ImageDTO>(),
        descriptions: new Array<DescriptionDTO>()
    }
}

interface IUpdateDescriptionPayload {
    descriptionId: number,
    descriptionDTO: DescriptionDTO
}

const oneSubRaceSlice = createSlice({
    name: "oneSubRace",
    initialState,
    reducers: {
        setSubRace(state, action: PayloadAction<EntryFullDTO>) {
            state.subRace = action.payload;
        },
        updateSubRace(state, action: PayloadAction<EntryDTO>) {
            state.subRace.subRace = action.payload;
        },

        addRaceDescription(state, action: PayloadAction<DescriptionDTO>) {
            state.subRace.descriptions?.push(action.payload);
        },
        updateRaceDescription(state, action: PayloadAction<IUpdateDescriptionPayload>) {
            state.subRace.descriptions?.splice(
                state.subRace.descriptions?.findIndex((description) => description.id === action.payload.descriptionId),
                1,
                action.payload.descriptionDTO);
        },
        removeRaceDescription(state, action: PayloadAction<number>) {
            state.subRace.descriptions = state.subRace.descriptions?.filter((description) => description.id !== action.payload);
        },

        addImageToSubRace(state, action: PayloadAction<ImageDTO>) {
            state.subRace.images?.push(action.payload);
        },
        removeImageFromSubRace(state, action: PayloadAction<number>) {
            state.subRace.images = state.subRace.images?.filter((image) => image.id !== action.payload);
        },

        setRaceToSubRace(state, action: PayloadAction<EntryDTO>) {
            state.subRace.race = action.payload;
        },
        removeRaceFromSubRace(state) {
            state.subRace.race = undefined;
        },

        addNewRegionToSubRace(state, action: PayloadAction<EntryDTO>) {
            state.subRace.regions?.push(action.payload);
        },
        removeRegionFromSubRace(state, action: PayloadAction<number>) {
            state.subRace.regions = state.subRace.regions?.filter((region) => region.id !== action.payload);
        },
    }
}
)

export const { setSubRace, updateSubRace,
    addRaceDescription, removeRaceDescription, updateRaceDescription,
    addImageToSubRace, removeImageFromSubRace,
    addNewRegionToSubRace, removeRegionFromSubRace,
    setRaceToSubRace, removeRaceFromSubRace } = oneSubRaceSlice.actions;
export default oneSubRaceSlice.reducer;