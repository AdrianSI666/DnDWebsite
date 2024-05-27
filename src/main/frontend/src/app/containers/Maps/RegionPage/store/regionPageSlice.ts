import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IRegionPageState } from "../types";
import { EntryDTO, ImageDTO, RegionDTO, Page } from "../../../../../services/openapi";

const initialState: IRegionPageState = {
    page: {
        currentPage: 1,
        totalPages: 1,
        data: new Array<RegionDTO>()
    }
}

interface IUpdateRegionPayload {
    id: number,
    entryDTO: EntryDTO
}

interface IAddImagePayload {
    regionId: number,
    imageDTO: ImageDTO
}

interface IRemoveImagePayload {
    regionId: number,
    imageId: number
}

interface IAddNewSubObjectPayload {
    regionId: number,
    subObjectDTO: EntryDTO
}

interface IRemoveSubObjectPayload {
    regionId: number,
    subObjectId: number
}

interface ISetNewDomObjectPayload {
    regionId: number,
    kingdomDTO: EntryDTO
}

const regionPageSlice = createSlice({
    name: "RegionPage",
    initialState,
    reducers: {
        setRegionPage(state, action: PayloadAction<Page<RegionDTO>>) {
            state.page.currentPage = action.payload.currentPage;
            state.page.totalPages = action.payload.totalPages;
            state.page.data = action.payload.data;
        },
        fillRegionData(state, action: PayloadAction<RegionDTO>) {
            state.page.data?.splice(
                state.page.data?.findIndex((region) => region.region?.id === action.payload.region?.id),
                1,
                action.payload);
        },
        addRegion(state, action: PayloadAction<RegionDTO>) {
            state.page.data?.unshift(action.payload);
        },
        removeRegion(state, action: PayloadAction<number>) {
            state.page.data = state.page.data?.filter((region) => region.region?.id !== action.payload);
        },
        updateRegion(state, action: PayloadAction<IUpdateRegionPayload>) {
            state.page.data!.at(
                state.page.data!.findIndex((region) => region.region?.id === action.payload.id))!
                .region = action.payload.entryDTO;
        },

        addImageToRegion(state, action: PayloadAction<IAddImagePayload>) {
            state.page.data?.at(
                state.page.data.findIndex((region) => region.region?.id === action.payload.regionId))!
                .images?.push(action.payload.imageDTO);
        },
        removeImageFromRegion(state, action: PayloadAction<IRemoveImagePayload>) {
            let images = state.page.data?.at(state.page.data.findIndex((region) => region.region?.id === action.payload.regionId))!.images;
            state.page.data!.at(state.page.data!.findIndex((region) => region.region?.id === action.payload.regionId))!.images = images?.filter((image) => image.id !== action.payload.imageId);
        },

        addNewPlaceToRegion(state, action: PayloadAction<IAddNewSubObjectPayload>) {
            state.page.data?.at(
                state.page.data.findIndex((region) => region.region?.id === action.payload.regionId))!
                .places?.push(action.payload.subObjectDTO);
        },
        removePlaceFromRegion(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let places = state.page.data!.find((region) => region.region?.id === action.payload.regionId)?.places?.filter((place) => place.id !== action.payload.subObjectId);
            state.page.data!.find((region) => region.region?.id === action.payload.regionId)!.places = places;
        },
        
        setKingdomToRegion(state, action: PayloadAction<ISetNewDomObjectPayload>) {
            state.page.data!.find((region) => region.region?.id === action.payload.regionId)!.kingdom = action.payload.kingdomDTO;
        },
        removeKingdomFromRegion(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            state.page.data!.find((region) => region.region?.id === action.payload.regionId)!.kingdom = undefined;
        },

        addNewCultureToRegion(state, action: PayloadAction<IAddNewSubObjectPayload>) {
            state.page.data?.at(
                state.page.data.findIndex((region) => region.region?.id === action.payload.regionId))!
                .cultures?.push(action.payload.subObjectDTO);
        },
        removeCultureFromRegion(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let cultures = state.page.data!.find((region) => region.region?.id === action.payload.regionId)?.cultures?.filter((culture) => culture.id !== action.payload.subObjectId);
            state.page.data!.find((region) => region.region?.id === action.payload.regionId)!.cultures = cultures;
        },

        addNewRaceToRegion(state, action: PayloadAction<IAddNewSubObjectPayload>) {
            state.page.data?.at(
                state.page.data.findIndex((region) => region.region?.id === action.payload.regionId))!
                .races?.push(action.payload.subObjectDTO);
        },
        removeRaceFromRegion(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let races = state.page.data!.find((region) => region.region?.id === action.payload.regionId)?.races?.filter((race) => race.id !== action.payload.subObjectId);
            state.page.data!.find((region) => region.region?.id === action.payload.regionId)!.races = races;
        },

        addNewSubRaceToRegion(state, action: PayloadAction<IAddNewSubObjectPayload>) {
            state.page.data?.at(
                state.page.data.findIndex((region) => region.region?.id === action.payload.regionId))!
                .subRaces?.push(action.payload.subObjectDTO);
        },
        removeSubRaceFromRegion(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let subRaces = state.page.data!.find((region) => region.region?.id === action.payload.regionId)?.subRaces?.filter((subRace) => subRace.id !== action.payload.subObjectId);
            state.page.data!.find((region) => region.region?.id === action.payload.regionId)!.subRaces = subRaces;
        },
    }
}
)

export const { setRegionPage, fillRegionData, addRegion, removeRegion, updateRegion, addImageToRegion, removeImageFromRegion, addNewPlaceToRegion, removePlaceFromRegion, setKingdomToRegion, removeKingdomFromRegion, addNewCultureToRegion, addNewRaceToRegion, addNewSubRaceToRegion, removeCultureFromRegion, removeRaceFromRegion, removeSubRaceFromRegion } = regionPageSlice.actions;
export default regionPageSlice.reducer;