import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../../services/openapi";
import { IOneWorldState } from "../../types";

const initialState: IOneWorldState = {
    world: {
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

        addWorldDescription(state, action: PayloadAction<DescriptionDTO>) {
            state.world.descriptions?.push(action.payload);
        },
        updateWorldDescription(state, action: PayloadAction<IUpdateDescriptionPayload>) {
            state.world.descriptions?.splice(
                state.world.descriptions?.findIndex((description) => description.id === action.payload.descriptionId),
                1,
                action.payload.descriptionDTO);
        },
        removeWorldDescription(state, action: PayloadAction<number>) {
            state.world.descriptions = state.world.descriptions?.filter((description) => description.id !== action.payload);
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

export const { setWorld, updateWorld,
    addWorldDescription, updateWorldDescription, removeWorldDescription,
    addImageToWorld, removeImageFromWorld,
    addNewPlaneToWorld, removePlaneFromWorld  } = OneWorldSlice.actions;
export default OneWorldSlice.reducer;