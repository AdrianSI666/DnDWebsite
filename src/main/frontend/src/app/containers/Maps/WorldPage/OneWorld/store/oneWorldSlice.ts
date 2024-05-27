import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../../services/openapi";
import { IOneWorldState } from "../../types";

const initialState: IOneWorldState = {
    world: {
        object: {},
        domObjects: {},
        subObjects: new Array<EntryDTO>(),
        images: new Array<ImageDTO>()
    }
}

const OneWorldSlice = createSlice({
    name: "oneWorld",
    initialState,
    reducers: {
        setWorld(state, action: PayloadAction<EntryFullDTO>) {
            state.world = action.payload;
        },
        updateWorld(state, action: PayloadAction<EntryDTO>) {
            state.world.object = action.payload;
        },
        addImageToWorld(state, action: PayloadAction<ImageDTO>) {
            state.world.images?.push(action.payload);
        },
        removeImageFromWorld(state, action: PayloadAction<number>) {
            state.world.images = state.world.images?.filter((image) => image.id !== action.payload);
        },
        addNewPlaneToWorld(state, action: PayloadAction<EntryDTO>) {
            state.world.subObjects?.push(action.payload);
        },
        removePlaneFromWorld(state, action: PayloadAction<number>) {
            state.world.subObjects = state.world.subObjects?.filter((plane) => plane.id !== action.payload);
        },
    }
}
)

export const { setWorld, updateWorld, addImageToWorld, removeImageFromWorld, addNewPlaneToWorld, removePlaneFromWorld  } = OneWorldSlice.actions;
export default OneWorldSlice.reducer;