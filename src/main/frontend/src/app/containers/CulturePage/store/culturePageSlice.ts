import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ICulturePageState } from "../types";
import { EntryDTO, EntryFullDTO, ImageDTO } from "../../../../services/openapi";
import { Page } from "../../../../services/openapi/models/Page";

const initialState: ICulturePageState = {
    page: {
        currentPage: 1,
        totalPages: 1,
        data: new Array<EntryFullDTO>()
    }
}

interface IUpdateCulturePayload {
    id: number,
    entryDTO: EntryDTO
}

interface IAddImagePayload {
    cultureId: number,
    imageDTO: ImageDTO
}

interface IRemoveImagePayload {
    cultureId: number,
    imageId: number
}

interface IAddRegionPayload {
    cultureId: number,
    regionDTO: EntryDTO
}

interface IRemoveRegionPayload {
    cultureId: number,
    regionId: number
}

const CulturePageSlice = createSlice({
    name: "homePage",
    initialState,
    reducers: {
        setCulturePage(state, action: PayloadAction<Page<EntryFullDTO>>) {
            state.page = action.payload;
        },
        fillCultureData(state, action: PayloadAction<EntryFullDTO>) {
            state.page.data?.splice(
                state.page.data?.findIndex((culture) => culture.object?.id === action.payload.object?.id),
                1,
                action.payload);
        },
        addCulture(state, action: PayloadAction<EntryFullDTO>) {
            state.page.data?.unshift(action.payload);
        },
        removeCulture(state, action: PayloadAction<number>) {
            console.log(action)
            state.page.data = state.page.data?.filter((culture) => culture.object?.id !== action.payload);
        },
        updateCulture(state, action: PayloadAction<IUpdateCulturePayload>) {
            console.log(action)
            state.page.data!.at(
                state.page.data!.findIndex((culture) => culture.object?.id === action.payload.id))!
                .object = action.payload.entryDTO;
        },
        addImageToCulture(state, action: PayloadAction<IAddImagePayload>) {
            state.page.data?.at(
                state.page.data!.findIndex((culture) => culture.object?.id === action.payload.cultureId))!
                .images?.push(action.payload.imageDTO);
        },
        removeImageFromCulture(state, action: PayloadAction<IRemoveImagePayload>) {
            let images = state.page.data?.at(state.page.data!.findIndex((culture) => culture.object?.id === action.payload.cultureId))!.images;
            state.page.data!.at(state.page.data!.findIndex((culture) => culture.object?.id === action.payload.cultureId))!.images = images?.filter((image) => image.id !== action.payload.imageId);
        },
        addNewRegionToCulture(state, action: PayloadAction<IAddRegionPayload>) {
            state.page.data?.at(
                state.page.data!.findIndex((culture) => culture.object?.id === action.payload.cultureId))!
                .subObjects?.push(action.payload.regionDTO);
        },
        removeRegionFromCulture(state, action: PayloadAction<IRemoveRegionPayload>) {
            let regions = state.page.data!.find((culture) => culture.object?.id === action.payload.cultureId)?.subObjects?.filter((region) => region.id !== action.payload.regionId);
            state.page.data!.find((culture) => culture.object?.id === action.payload.cultureId)!.subObjects = regions;
        },
    }
}
)

export const { setCulturePage, fillCultureData, addCulture, removeCulture, updateCulture, addImageToCulture, removeImageFromCulture, addNewRegionToCulture, removeRegionFromCulture } = CulturePageSlice.actions;
export default CulturePageSlice.reducer;