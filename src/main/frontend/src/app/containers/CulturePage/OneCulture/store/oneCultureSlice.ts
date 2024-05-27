import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../services/openapi";
import { IOneCultureState } from "../../types";

const initialState: IOneCultureState = {
    culture: {
        object: {},
        domObjects: {},
        subObjects: new Array<EntryDTO>(),
        images: new Array<ImageDTO>()
    }
}

const OneCultureSlice = createSlice({
    name: "oneCulture",
    initialState,
    reducers: {
        setCulture(state, action: PayloadAction<EntryFullDTO>) {
            state.culture = action.payload;
        },
        updateCulture(state, action: PayloadAction<EntryDTO>) {
            state.culture.object = action.payload;
        },
        addImageToCulture(state, action: PayloadAction<ImageDTO>) {
            state.culture.images?.push(action.payload);
        },
        removeImageFromCulture(state, action: PayloadAction<number>) {
            state.culture.images = state.culture.images?.filter((image) => image.id !== action.payload);
        },
        addNewRegionToCulture(state, action: PayloadAction<EntryDTO>) {
            state.culture.subObjects?.push(action.payload);
        },
        removeRegionFromCulture(state, action: PayloadAction<number>) {
            state.culture.subObjects = state.culture.subObjects?.filter((region) => region.id !== action.payload);
        },
    }
}
)

export const { setCulture, updateCulture, addImageToCulture, removeImageFromCulture, addNewRegionToCulture, removeRegionFromCulture } = OneCultureSlice.actions;
export default OneCultureSlice.reducer;