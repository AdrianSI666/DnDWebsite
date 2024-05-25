import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../../services/openapi";
import { IOneKingdomState } from "../../types";

const initialState: IOneKingdomState = {
    kingdom: {
        object: {},
        domObjects: {},
        subObjects: new Array<EntryDTO>(),
        images: new Array<ImageDTO>()
    }
}

const OneKingdomSlice = createSlice({
    name: "oneKingdom",
    initialState,
    reducers: {
        setKingdom(state, action: PayloadAction<EntryFullDTO>) {
            state.kingdom = action.payload;
        },
        updateKingdom(state, action: PayloadAction<EntryDTO>) {
            state.kingdom.object = action.payload;
        },
        addImageToKingdom(state, action: PayloadAction<ImageDTO>) {
            state.kingdom.images?.push(action.payload);
        },
        removeImageFromKingdom(state, action: PayloadAction<number>) {
            state.kingdom.images = state.kingdom.images?.filter((image) => image.id !== action.payload);
        },
        setContinentToKingdom(state, action: PayloadAction<EntryDTO>) {
            state.kingdom.domObjects = action.payload;
        },
        removeContinentFromKingdom(state) {
            state.kingdom.domObjects = undefined;
        },
        addNewRegionToKingdom(state, action: PayloadAction<EntryDTO>) {
            state.kingdom.subObjects?.push(action.payload);
        },
        removeRegionFromKingdom(state, action: PayloadAction<number>) {
            state.kingdom.subObjects = state.kingdom.subObjects?.filter((region) => region.id !== action.payload);
        },
    }
}
)

export const { setKingdom, updateKingdom, addImageToKingdom, removeImageFromKingdom, setContinentToKingdom, removeContinentFromKingdom , addNewRegionToKingdom, removeRegionFromKingdom  } = OneKingdomSlice.actions;
export default OneKingdomSlice.reducer;