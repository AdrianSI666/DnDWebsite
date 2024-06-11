import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../../services/openapi";
import { IOnePlaceState } from "../../types";

const initialState: IOnePlaceState = {
    place: {
        object: {},
        domObjects: {},
        subObjects: new Array<EntryDTO>(),
        images: new Array<ImageDTO>(),
        descriptions: new Array<DescriptionDTO>()
    }
}

interface IUpdateDescriptionPayload {
    descriptionId: number,
    descriptionDTO: DescriptionDTO
}

const OnePlaceSlice = createSlice({
    name: "onePlace",
    initialState,
    reducers: {
        setPlace(state, action: PayloadAction<EntryFullDTO>) {
            state.place = action.payload;
        },
        updatePlace(state, action: PayloadAction<EntryDTO>) {
            state.place.object = action.payload;
        },

        addPlaceDescription(state, action: PayloadAction<DescriptionDTO>) {
            state.place.descriptions?.push(action.payload);
        },
        updatePlaceDescription(state, action: PayloadAction<IUpdateDescriptionPayload>) {
            state.place.descriptions?.splice(
                state.place.descriptions?.findIndex((description) => description.id === action.payload.descriptionId),
                1,
                action.payload.descriptionDTO);
        },
        removePlaceDescription(state, action: PayloadAction<number>) {
            state.place.descriptions = state.place.descriptions?.filter((description) => description.id !== action.payload);
        },

        addImageToPlace(state, action: PayloadAction<ImageDTO>) {
            state.place.images?.push(action.payload);
        },
        removeImageFromPlace(state, action: PayloadAction<number>) {
            state.place.images = state.place.images?.filter((image) => image.id !== action.payload);
        },

        setRegionToPlace(state, action: PayloadAction<EntryDTO>) {
            state.place.domObjects = action.payload;
        },
        removeRegionFromPlace(state) {
            state.place.domObjects = undefined;
        },
    }
}
)

export const { setPlace, updatePlace,
    addPlaceDescription, updatePlaceDescription, removePlaceDescription,
    addImageToPlace,removeImageFromPlace,
    setRegionToPlace, removeRegionFromPlace  } = OnePlaceSlice.actions;
export default OnePlaceSlice.reducer;