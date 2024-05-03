import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../../services/openapi";
import { IOnePlaneState } from "../../types";

const initialState: IOnePlaneState = {
    plane: {
        object: {},
        domObjects: {},
        subObjects: new Array<EntryDTO>(),
        images: new Array<ImageDTO>()
    }
}

const OnePlaneSlice = createSlice({
    name: "onePlane",
    initialState,
    reducers: {
        setPlane(state, action: PayloadAction<EntryFullDTO>) {
            state.plane = action.payload;
        },
        updatePlane(state, action: PayloadAction<EntryDTO>) {
            state.plane.object = action.payload;
        },
        addImageToPlane(state, action: PayloadAction<ImageDTO>) {
            state.plane.images?.push(action.payload);
        },
        removeImageFromPlane(state, action: PayloadAction<number>) {
            state.plane.images = state.plane.images?.filter((image) => image.id !== action.payload);
        },
        setWorldToPlane(state, action: PayloadAction<EntryDTO>) {
            state.plane.domObjects = action.payload;
        },
        removeWorldFromPlane(state) {
            state.plane.domObjects = undefined;
        },
        addNewContinentToPlane(state, action: PayloadAction<EntryDTO>) {
            state.plane.subObjects?.push(action.payload);
        },
        removeContinentFromPlane(state, action: PayloadAction<number>) {
            state.plane.subObjects = state.plane.subObjects?.filter((continent) => continent.id !== action.payload);
        },
    }
}
)

export const { setPlane, updatePlane, addImageToPlane, removeImageFromPlane, setWorldToPlane, removeWorldFromPlane , addNewContinentToPlane, removeContinentFromPlane  } = OnePlaneSlice.actions;
export default OnePlaneSlice.reducer;