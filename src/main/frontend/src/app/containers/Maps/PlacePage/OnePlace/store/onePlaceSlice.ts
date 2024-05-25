import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../../services/openapi";
import { IOnePlaceState } from "../../types";

const initialState: IOnePlaceState = {
    place: {
        object: {},
        domObjects: {},
        subObjects: new Array<EntryDTO>(),
        images: new Array<ImageDTO>()
    }
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

export const { setPlace, updatePlace, addImageToPlace, removeImageFromPlace, setRegionToPlace, removeRegionFromPlace  } = OnePlaceSlice.actions;
export default OnePlaceSlice.reducer;