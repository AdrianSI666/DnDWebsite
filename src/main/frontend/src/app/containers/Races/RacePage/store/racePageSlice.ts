import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IRacePageState } from "../types";
import { EntryDTO, ImageDTO, RaceDTO } from "../../../../../services/openapi";
import { Page } from "../../../../../services/openapi/models/Page";

const initialState: IRacePageState = {
    page: {
        currentPage: 1,
        totalPages: 1,
        data: new Array<RaceDTO>()
    }
}

interface IUpdateRacePayload {
    id: number,
    entryDTO: EntryDTO
}

interface IAddImagePayload {
    raceId: number,
    imageDTO: ImageDTO
}

interface IRemoveImagePayload {
    raceId: number,
    imageId: number
}

interface IAddNewSubObjectPayload {
    raceId: number,
    subObjectEntryDTO: EntryDTO
}

interface IRemoveSubObjectPayload {
    raceId: number,
    subObjectId: number
}

const racePageSlice = createSlice({
    name: "racePage",
    initialState,
    reducers: {
        setRacePage(state, action: PayloadAction<Page<RaceDTO>>) {
            state.page.currentPage = action.payload.currentPage;
            state.page.totalPages = action.payload.totalPages;
            state.page.data = action.payload.data;
        },
        fillRaceData(state, action: PayloadAction<RaceDTO>) {
            state.page.data?.splice(
                state.page.data?.findIndex((race) => race.race?.id === action.payload.race?.id),
                1,
                action.payload);
        },
        addRace(state, action: PayloadAction<RaceDTO>) {
            state.page.data?.unshift(action.payload);
        },
        removeRace(state, action: PayloadAction<number>) {
            console.log(action)
            state.page.data = state.page.data?.filter((race) => race.race?.id !== action.payload);
        },
        updateRace(state, action: PayloadAction<IUpdateRacePayload>) {
            console.log(action)
            state.page.data!.at(
                state.page.data!.findIndex((race) => race.race?.id === action.payload.id))!
                .race = action.payload.entryDTO;
        },
        addImageToRace(state, action: PayloadAction<IAddImagePayload>) {
            state.page.data?.at(
                state.page.data.findIndex((race) => race.race?.id === action.payload.raceId))!
                .images?.push(action.payload.imageDTO);
        },
        removeImageFromRace(state, action: PayloadAction<IRemoveImagePayload>) {
            let images = state.page.data?.at(state.page.data.findIndex((race) => race.race?.id === action.payload.raceId))!.images;
            state.page.data!.at(state.page.data!.findIndex((race) => race.race?.id === action.payload.raceId))!.images = images?.filter((image) => image.id !== action.payload.imageId);
        },
        addNewSubRaceToRace(state, action: PayloadAction<IAddNewSubObjectPayload>) {
            state.page.data?.at(
                state.page.data.findIndex((race) => race.race?.id === action.payload.raceId))!
                .subRaces?.push(action.payload.subObjectEntryDTO);
        },
        removeSubRaceFromRace(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let subRaces = state.page.data!.find((race) => race.race?.id === action.payload.raceId)?.subRaces?.filter((subRace) => subRace.id !== action.payload.subObjectId);
            state.page.data!.find((race) => race.race?.id === action.payload.raceId)!.subRaces = subRaces;
        },
        addNewRegionToRace(state, action: PayloadAction<IAddNewSubObjectPayload>) {
            state.page.data?.at(
                state.page.data.findIndex((race) => race.race?.id === action.payload.raceId))!
                .regions?.push(action.payload.subObjectEntryDTO);
        },
        removeRegionFromRace(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let regions = state.page.data!.find((race) => race.race?.id === action.payload.raceId)?.regions?.filter((region) => region.id !== action.payload.subObjectId);
            state.page.data!.find((race) => race.race?.id === action.payload.raceId)!.regions = regions;
        },
    }
}
)

export const { setRacePage, fillRaceData, addRace, removeRace, updateRace, addImageToRace, removeImageFromRace, addNewSubRaceToRace, removeSubRaceFromRace, addNewRegionToRace, removeRegionFromRace } = racePageSlice.actions;
export default racePageSlice.reducer;