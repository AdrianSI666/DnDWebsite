import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../../services/openapi";
import { IOneRegionState } from "../../types";

const initialState: IOneRegionState = {
    region: {
        region: {},
        kingdom: {},
        places: new Array<EntryDTO>(),
        images: new Array<ImageDTO>(),
        cultures: new Array<EntryDTO>(),
        races: new Array<EntryDTO>(),
        subRaces: new Array<EntryDTO>(),
        descriptions: new Array<DescriptionDTO>()
    }
}

interface IUpdateDescriptionPayload {
    descriptionId: number,
    descriptionDTO: DescriptionDTO
}

const OneRegionSlice = createSlice({
    name: "oneRegion",
    initialState,
    reducers: {
        setRegion(state, action: PayloadAction<EntryFullDTO>) {
            state.region = action.payload;
        },
        updateRegion(state, action: PayloadAction<EntryDTO>) {
            state.region.region = action.payload;
        },

        addRegionDescription(state, action: PayloadAction<DescriptionDTO>) {
            state.region.descriptions?.push(action.payload);
        },
        updateRegionDescription(state, action: PayloadAction<IUpdateDescriptionPayload>) {
            state.region.descriptions?.splice(
                state.region.descriptions?.findIndex((description) => description.id === action.payload.descriptionId),
                1,
                action.payload.descriptionDTO);
        },
        removeRegionDescription(state, action: PayloadAction<number>) {
            state.region.descriptions = state.region.descriptions?.filter((description) => description.id !== action.payload);
        },

        addImageToRegion(state, action: PayloadAction<ImageDTO>) {
            state.region.images?.push(action.payload);
        },
        removeImageFromRegion(state, action: PayloadAction<number>) {
            state.region.images = state.region.images?.filter((image) => image.id !== action.payload);
        },

        setKingdomToRegion(state, action: PayloadAction<EntryDTO>) {
            state.region.kingdom = action.payload;
        },
        removeKingdomFromRegion(state) {
            state.region.kingdom = undefined;
        },

        addNewPlaceToRegion(state, action: PayloadAction<EntryDTO>) {
            state.region.places?.push(action.payload);
        },
        removePlaceFromRegion(state, action: PayloadAction<number>) {
            state.region.places = state.region.places?.filter((place) => place.id !== action.payload);
        },

        addNewCultureToRegion(state, action: PayloadAction<EntryDTO>) {
            state.region.cultures?.push(action.payload);
        },
        removeCultureFromRegion(state, action: PayloadAction<number>) {
            state.region.cultures = state.region.cultures?.filter((culture) => culture.id !== action.payload);
        },

        addNewRaceToRegion(state, action: PayloadAction<EntryDTO>) {
            state.region.races?.push(action.payload);
        },
        removeRaceFromRegion(state, action: PayloadAction<number>) {
            state.region.races = state.region.races?.filter((race) => race.id !== action.payload);
        },

        addNewSubRaceToRegion(state, action: PayloadAction<EntryDTO>) {
            state.region.subRaces?.push(action.payload);
        },
        removeSubRaceFromRegion(state, action: PayloadAction<number>) {
            state.region.subRaces = state.region.subRaces?.filter((subRace) => subRace.id !== action.payload);
        },
    }
}
)

export const { setRegion, updateRegion,
    addRegionDescription, updateRegionDescription, removeRegionDescription,
    addImageToRegion, removeImageFromRegion,
    setKingdomToRegion, removeKingdomFromRegion,
    addNewPlaceToRegion, removePlaceFromRegion,
    addNewCultureToRegion, removeCultureFromRegion,
    addNewRaceToRegion, removeRaceFromRegion,
    addNewSubRaceToRegion, removeSubRaceFromRegion
  } = OneRegionSlice.actions;
export default OneRegionSlice.reducer;