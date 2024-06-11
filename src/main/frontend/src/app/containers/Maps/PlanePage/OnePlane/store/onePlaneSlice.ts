import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../../services/openapi";
import { IOnePlaneState } from "../../types";

const initialState: IOnePlaneState = {
    plane: {
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

        addPlaneDescription(state, action: PayloadAction<DescriptionDTO>) {
            state.plane.descriptions?.push(action.payload);
        },
        updatePlaneDescription(state, action: PayloadAction<IUpdateDescriptionPayload>) {
            state.plane.descriptions?.splice(
                state.plane.descriptions?.findIndex((description) => description.id === action.payload.descriptionId),
                1,
                action.payload.descriptionDTO);
        },
        removePlaneDescription(state, action: PayloadAction<number>) {
            state.plane.descriptions = state.plane.descriptions?.filter((description) => description.id !== action.payload);
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

export const { setPlane, updatePlane,
    addPlaneDescription, updatePlaneDescription, removePlaneDescription,
    addImageToPlane, removeImageFromPlane,
    setWorldToPlane, removeWorldFromPlane ,
    addNewContinentToPlane, removeContinentFromPlane  } = OnePlaneSlice.actions;
export default OnePlaneSlice.reducer;