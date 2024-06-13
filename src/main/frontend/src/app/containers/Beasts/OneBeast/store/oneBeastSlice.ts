import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../services/openapi";
import { IOneBeastState } from "../../types";

const initialState: IOneBeastState = {
    beast: {
        beast: {},
        regions: new Array<EntryDTO>(),
        images: new Array<ImageDTO>(),
        description: new Array<DescriptionDTO>()
    }
}

interface IUpdateDescriptionPayload {
    descriptionId: number,
    descriptionDTO: DescriptionDTO
}

const OneBeastSlice = createSlice({
    name: "oneBeast",
    initialState,
    reducers: {
        setBeast(state, action: PayloadAction<EntryFullDTO>) {
            state.beast = action.payload;
        },
        updateBeast(state, action: PayloadAction<EntryDTO>) {
            state.beast.beast = action.payload;
        },

        addBeastDescription(state, action: PayloadAction<DescriptionDTO>) {
            state.beast.description?.push(action.payload);
        },
        updateBeastDescription(state, action: PayloadAction<IUpdateDescriptionPayload>) {
            state.beast.description?.splice(
                state.beast.description?.findIndex((description) => description.id === action.payload.descriptionId),
                1,
                action.payload.descriptionDTO);
        },
        removeBeastDescription(state, action: PayloadAction<number>) {
            state.beast.description = state.beast.description?.filter((description) => description.id !== action.payload);
        },

        addImageToBeast(state, action: PayloadAction<ImageDTO>) {
            state.beast.images?.push(action.payload);
        },
        removeImageFromBeast(state, action: PayloadAction<number>) {
            state.beast.images = state.beast.images?.filter((image) => image.id !== action.payload);
        },
        addNewRegionToBeast(state, action: PayloadAction<EntryDTO>) {
            state.beast.regions?.push(action.payload);
        },
        removeRegionFromBeast(state, action: PayloadAction<number>) {
            state.beast.regions = state.beast.regions?.filter((region) => region.id !== action.payload);
        },
    }
}
)

export const { setBeast, updateBeast,
    addBeastDescription, updateBeastDescription, removeBeastDescription,
    addImageToBeast, removeImageFromBeast,
    addNewRegionToBeast, removeRegionFromBeast } = OneBeastSlice.actions;
export default OneBeastSlice.reducer;