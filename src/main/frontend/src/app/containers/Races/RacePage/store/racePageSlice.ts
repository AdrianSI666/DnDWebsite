import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IRacePageState } from "../types";
import { DescriptionDTO, EntryDTO, ImageDTO, RaceDTO } from "../../../../../services/openapi";
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

interface IAddDescriptionPayload {
    raceId: number,
    descriptionDTO: DescriptionDTO
}

interface IUpdateDescriptionPayload {
    raceId: number,
    descriptionId: number,
    descriptionDTO: DescriptionDTO
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

        addRaceDescription(state, action: PayloadAction<IAddDescriptionPayload>) {
            state.page.data?.at(
                state.page.data!.findIndex((race) => race.race?.id === action.payload.raceId))!
                .descriptions?.push(action.payload.descriptionDTO);
        },
        updateRaceDescription(state, action: PayloadAction<IUpdateDescriptionPayload>) {
            state.page.data!.at( state.page.data!.findIndex((race) => race.race?.id === action.payload.raceId))!.descriptions = 
            state.page.data?.at(
                state.page.data!.findIndex((race) => race.race?.id === action.payload.raceId))!
                .descriptions?.map((description) => {
                    if(description.id === action.payload.descriptionId) {
                        return action.payload.descriptionDTO;
                    }
                    return description;
                });
        },
        removeRaceDescription(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let descriptions = state.page.data?.at(state.page.data!.findIndex((race) => race.race?.id === action.payload.raceId))!.descriptions;
            state.page.data!.at(state.page.data!.findIndex((race) => race.race?.id === action.payload.raceId))!.descriptions = descriptions?.filter((description) => description.id !== action.payload.subObjectId);
        },

        addImageToRace(state, action: PayloadAction<IAddImagePayload>) {
            state.page.data?.at(
                state.page.data.findIndex((race) => race.race?.id === action.payload.raceId))!
                .images?.push(action.payload.imageDTO);
        },
        removeImageFromRace(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let images = state.page.data?.at(state.page.data.findIndex((race) => race.race?.id === action.payload.raceId))!.images;
            state.page.data!.at(state.page.data!.findIndex((race) => race.race?.id === action.payload.raceId))!.images = images?.filter((image) => image.id !== action.payload.subObjectId);
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

export const { setRacePage, fillRaceData, addRace, removeRace, updateRace,
    addRaceDescription, updateRaceDescription, removeRaceDescription,
     addImageToRace, removeImageFromRace,
    addNewSubRaceToRace, removeSubRaceFromRace,
     addNewRegionToRace, removeRegionFromRace } = racePageSlice.actions;
export default racePageSlice.reducer;