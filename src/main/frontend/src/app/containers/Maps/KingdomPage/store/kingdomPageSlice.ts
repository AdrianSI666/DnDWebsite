import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IKingdomPageState } from "../types";
import { EntryDTO, EntryFullDTO, ImageDTO, Page } from "../../../../../services/openapi";

const initialState: IKingdomPageState = {
    page: {
        currentPage: 1,
        totalPages: 1,
        data: new Array<EntryFullDTO>()
    }
}

interface IUpdateKingdomPayload {
    id: number,
    entryDTO: EntryDTO
}

interface IAddImagePayload {
    kingdomId: number,
    imageDTO: ImageDTO
}

interface IRemoveImagePayload {
    kingdomId: number,
    imageId: number
}

interface IAddNewSubObjectPayload {
    kingdomId: number,
    regionDTO: EntryDTO
}

interface IRemoveSubObjectPayload {
    kingdomId: number,
    subObjectId: number
}

interface ISetNewDomObjectPayload {
    kingdomId: number,
    continentDTO: EntryDTO
}

const kingdomPageSlice = createSlice({
    name: "KingdomPage",
    initialState,
    reducers: {
        setKingdomPage(state, action: PayloadAction<Page<EntryFullDTO>>) {
            state.page.currentPage = action.payload.currentPage;
            state.page.totalPages = action.payload.totalPages;
            state.page.data = action.payload.data;
        },
        fillKingdomData(state, action: PayloadAction<EntryFullDTO>) {
            state.page.data?.splice(
                state.page.data?.findIndex((kingdom) => kingdom.object?.id === action.payload.object?.id),
                1,
                action.payload);
        },
        addKingdom(state, action: PayloadAction<EntryFullDTO>) {
            state.page.data?.unshift(action.payload);
        },
        removeKingdom(state, action: PayloadAction<number>) {
            console.log(action)
            state.page.data = state.page.data?.filter((kingdom) => kingdom.object?.id !== action.payload);
        },
        updateKingdom(state, action: PayloadAction<IUpdateKingdomPayload>) {
            console.log(action)
            state.page.data!.at(
                state.page.data!.findIndex((kingdom) => kingdom.object?.id === action.payload.id))!
                .object = action.payload.entryDTO;
        },
        addImageToKingdom(state, action: PayloadAction<IAddImagePayload>) {
            state.page.data?.at(
                state.page.data.findIndex((kingdom) => kingdom.object?.id === action.payload.kingdomId))!
                .images?.push(action.payload.imageDTO);
        },
        removeImageFromKingdom(state, action: PayloadAction<IRemoveImagePayload>) {
            let images = state.page.data?.at(state.page.data.findIndex((kingdom) => kingdom.object?.id === action.payload.kingdomId))!.images;
            state.page.data!.at(state.page.data!.findIndex((kingdom) => kingdom.object?.id === action.payload.kingdomId))!.images = images?.filter((image) => image.id !== action.payload.imageId);
        },
        addNewRegionToKingdom(state, action: PayloadAction<IAddNewSubObjectPayload>) {
            state.page.data?.at(
                state.page.data.findIndex((kingdom) => kingdom.object?.id === action.payload.kingdomId))!
                .subObjects?.push(action.payload.regionDTO);
        },
        removeRegionFromKingdom(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let subKingdoms = state.page.data!.find((kingdom) => kingdom.object?.id === action.payload.kingdomId)?.subObjects?.filter((region) => region.id !== action.payload.subObjectId);
            state.page.data!.find((kingdom) => kingdom.object?.id === action.payload.kingdomId)!.subObjects = subKingdoms;
        },
        setContinentToKingdom(state, action: PayloadAction<ISetNewDomObjectPayload>) {
            state.page.data!.find((kingdom) => kingdom.object?.id === action.payload.kingdomId)!.domObjects = action.payload.continentDTO;
        },
        removeContinentFromKingdom(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            state.page.data!.find((kingdom) => kingdom.object?.id === action.payload.kingdomId)!.domObjects = undefined;
        },
    }
}
)

export const { setKingdomPage, fillKingdomData, addKingdom, removeKingdom, updateKingdom, addImageToKingdom, removeImageFromKingdom, addNewRegionToKingdom, removeRegionFromKingdom, setContinentToKingdom, removeContinentFromKingdom } = kingdomPageSlice.actions;
export default kingdomPageSlice.reducer;