import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IBeastPageState } from "../types";
import { DescriptionDTO, EntryDTO, ImageDTO, BeastDTO } from "../../../../services/openapi";
import { Page } from "../../../../services/openapi/models/Page";

const initialState: IBeastPageState = {
    page: {
        currentPage: 1,
        totalPages: 1,
        data: new Array<BeastDTO>()
    }
}

interface IUpdateBeastPayload {
    id: number,
    entryDTO: EntryDTO
}

interface IAddImagePayload {
    beastId: number,
    imageDTO: ImageDTO
}

interface IAddDescriptionPayload {
    beastId: number,
    descriptionDTO: DescriptionDTO
}

interface IUpdateDescriptionPayload {
    beastId: number,
    descriptionId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddRegionPayload {
    beastId: number,
    regionDTO: EntryDTO
}

interface IRemoveRegionPayload {
    beastId: number,
    regionId: number
}

interface IRemoveSubObjectPayload {
    beastId: number,
    subObjectId: number
}

const beastPageSlice = createSlice({
    name: "beastPage",
    initialState,
    reducers: {
        setBeastPage(state, action: PayloadAction<Page<BeastDTO>>) {
            state.page.currentPage = action.payload.currentPage;
            state.page.totalPages = action.payload.totalPages;
            state.page.data = action.payload.data;
        },
        fillBeastData(state, action: PayloadAction<BeastDTO>) {
            state.page.data?.splice(
                state.page.data?.findIndex((beast) => beast.beast?.id === action.payload.beast?.id),
                1,
                action.payload);
        },
        addBeast(state, action: PayloadAction<BeastDTO>) {
            state.page.data?.unshift(action.payload);
        },
        removeBeast(state, action: PayloadAction<number>) {
            console.log(action)
            state.page.data = state.page.data?.filter((beast) => beast.beast?.id !== action.payload);
        },
        updateBeast(state, action: PayloadAction<IUpdateBeastPayload>) {
            console.log(action)
            state.page.data!.at(
                state.page.data!.findIndex((beast) => beast.beast?.id === action.payload.id))!
                .beast = action.payload.entryDTO;
        },

        addBeastDescription(state, action: PayloadAction<IAddDescriptionPayload>) {
            state.page.data?.at(
                state.page.data!.findIndex((beast) => beast.beast?.id === action.payload.beastId))!
                .description?.push(action.payload.descriptionDTO);
        },
        updateBeastDescription(state, action: PayloadAction<IUpdateDescriptionPayload>) {
            state.page.data!.at( state.page.data!.findIndex((race) => race.beast?.id === action.payload.beastId))!.description = 
            state.page.data?.at(
                state.page.data!.findIndex((beast) => beast.beast?.id === action.payload.beastId))!
                .description?.map((description) => {
                    if(description.id === action.payload.descriptionId) {
                        return action.payload.descriptionDTO;
                    }
                    return description;
                });
        },
        removeBeastDescription(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let descriptions = state.page.data?.at(state.page.data!.findIndex((beast) => beast.beast?.id === action.payload.beastId))!.description;
            state.page.data!.at(state.page.data!.findIndex((race) => race.beast?.id === action.payload.beastId))!.description = descriptions?.filter((description) => description.id !== action.payload.subObjectId);
        },

        addImageToBeast(state, action: PayloadAction<IAddImagePayload>) {
            state.page.data?.at(
                state.page.data.findIndex((beast) => beast.beast?.id === action.payload.beastId))!
                .images?.push(action.payload.imageDTO);
        },
        removeImageFromBeast(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let images = state.page.data?.at(state.page.data.findIndex((beast) => beast.beast?.id === action.payload.beastId))!.images;
            state.page.data!.at(state.page.data!.findIndex((beast) => beast.beast?.id === action.payload.beastId))!.images = images?.filter((image) => image.id !== action.payload.subObjectId);
        },

        
        addNewRegionToBeast(state, action: PayloadAction<IAddRegionPayload>) {
            state.page.data?.at(
                state.page.data.findIndex((beast) => beast.beast?.id === action.payload.beastId))!
                .regions?.push(action.payload.regionDTO);
        },
        
        removeRegionFromBeast(state, action: PayloadAction<IRemoveRegionPayload>) {
            let regions = state.page.data!.find((beast) => beast.beast?.id === action.payload.beastId)?.regions?.filter((region) => region.id !== action.payload.regionId);
            state.page.data!.find((beast) => beast.beast?.id === action.payload.beastId)!.regions = regions;
        },
    }
}
)

export const { setBeastPage, fillBeastData, addBeast, removeBeast, updateBeast,
    addBeastDescription, updateBeastDescription, removeBeastDescription,
     addImageToBeast, removeImageFromBeast,
     addNewRegionToBeast, removeRegionFromBeast } = beastPageSlice.actions;
export default beastPageSlice.reducer;