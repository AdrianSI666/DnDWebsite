import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../services/openapi";
import { IOneCultureState } from "../../types";

const initialState: IOneCultureState = {
    culture: {
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

        addCultureDescription(state, action: PayloadAction<DescriptionDTO>) {
            state.culture.descriptions?.push(action.payload);
        },
        updateCultureDescription(state, action: PayloadAction<IUpdateDescriptionPayload>) {
            state.culture.descriptions?.splice(
                state.culture.descriptions?.findIndex((description) => description.id === action.payload.descriptionId),
                1,
                action.payload.descriptionDTO);
        },
        removeCultureDescription(state, action: PayloadAction<number>) {
            state.culture.descriptions = state.culture.descriptions?.filter((description) => description.id !== action.payload);
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

export const { setCulture, updateCulture,
    addCultureDescription, updateCultureDescription, removeCultureDescription,
    addImageToCulture, removeImageFromCulture,
    addNewRegionToCulture, removeRegionFromCulture } = OneCultureSlice.actions;
export default OneCultureSlice.reducer;