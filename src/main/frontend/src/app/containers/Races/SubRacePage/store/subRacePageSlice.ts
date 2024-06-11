import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ISubRacePageState } from "../types";
import { DescriptionDTO, EntryDTO, ImageDTO, SubRaceDTO } from "../../../../../services/openapi";
import { Page } from "../../../../../services/openapi/models/Page";

const initialState: ISubRacePageState = {
    page: {
        currentPage: 1,
        totalPages: 1,
        data: new Array<SubRaceDTO>()
    }
}

interface IUpdateSubRacePayload {
    id: number,
    entryDTO: EntryDTO
}

interface IAddDescriptionPayload {
    subRaceId: number,
    descriptionDTO: DescriptionDTO
}

interface IUpdateDescriptionPayload {
    subRaceId: number,
    descriptionId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    subRaceId: number,
    imageDTO: ImageDTO
}

interface ISetNewSubObjectPayload {
    subRaceId: number,
    entryDTO: EntryDTO
}

interface IRemoveSubObjectPayload {
    subRaceId: number,
    subObjectId: number
}

const subRacePageSlice = createSlice({
    name: "SubRacePage",
    initialState,
    reducers: {
        setSubRacePage(state, action: PayloadAction<Page<SubRaceDTO>>) {
            state.page.currentPage = action.payload.currentPage;
            state.page.totalPages = action.payload.totalPages;
            state.page.data = action.payload.data;
        },
        fillSubRaceData(state, action: PayloadAction<SubRaceDTO>) {
            state.page.data?.splice(
                state.page.data?.findIndex((subRace) => subRace.subRace?.id === action.payload.subRace?.id),
                1,
                action.payload);
        },
        addSubRace(state, action: PayloadAction<SubRaceDTO>) {
            state.page.data?.unshift(action.payload);
        },
        removeSubRace(state, action: PayloadAction<number>) {
            console.log(action)
            state.page.data = state.page.data?.filter((subRace) => subRace.subRace?.id !== action.payload);
        },
        updateSubRace(state, action: PayloadAction<IUpdateSubRacePayload>) {
            console.log(action)
            state.page.data!.at(
                state.page.data!.findIndex((subRace) => subRace.subRace?.id === action.payload.id))!
                .subRace = action.payload.entryDTO;
        },

        addSubRaceDescription(state, action: PayloadAction<IAddDescriptionPayload>) {
            state.page.data?.at(
                state.page.data!.findIndex((subRace) => subRace.subRace?.id === action.payload.subRaceId))!
                .descriptions?.push(action.payload.descriptionDTO);
        },
        updateSubRaceDescription(state, action: PayloadAction<IUpdateDescriptionPayload>) {
            state.page.data!.at(state.page.data!.findIndex((subRace) => subRace.subRace?.id === action.payload.subRaceId))!.descriptions =
                state.page.data?.at(
                    state.page.data!.findIndex((subRace) => subRace.subRace?.id === action.payload.subRaceId))!
                    .descriptions?.map((description) => {
                        if (description.id === action.payload.descriptionId) {
                            return action.payload.descriptionDTO;
                        }
                        return description;
                    });
        },
        removeSubRaceDescription(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let descriptions = state.page.data?.at(state.page.data!.findIndex((subRace) => subRace.subRace?.id === action.payload.subRaceId))!.descriptions;
            state.page.data!.at(state.page.data!.findIndex((subRace) => subRace.subRace?.id === action.payload.subRaceId))!.descriptions = descriptions?.filter((description) => description.id !== action.payload.subObjectId);
        },

        addImageToSubRace(state, action: PayloadAction<IAddImagePayload>) {
            state.page.data?.at(
                state.page.data.findIndex((subRace) => subRace.subRace?.id === action.payload.subRaceId))!
                .images?.push(action.payload.imageDTO);
        },
        removeImageFromSubRace(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let images = state.page.data?.at(state.page.data.findIndex((subRace) => subRace.subRace?.id === action.payload.subRaceId))!.images;
            state.page.data!.at(state.page.data!.findIndex((subRace) => subRace.subRace?.id === action.payload.subRaceId))!.images = images?.filter((image) => image.id !== action.payload.subObjectId);
        },

        setRaceToSubRace(state, action: PayloadAction<ISetNewSubObjectPayload>) {
            state.page.data!.find((subRace) => subRace.subRace?.id === action.payload.subRaceId)!.race = action.payload.entryDTO;
        },
        removeRaceFromSubRace(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            state.page.data!.find((subRace) => subRace.subRace?.id === action.payload.subRaceId)!.race = undefined;
        },

        addNewRegionToSubRace(state, action: PayloadAction<ISetNewSubObjectPayload>) {
            state.page.data?.at(
                state.page.data.findIndex((subRace) => subRace.subRace?.id === action.payload.subRaceId))!
                .regions?.push(action.payload.entryDTO);
        },
        removeRegionFromSubRace(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let regions = state.page.data!.find((subRace) => subRace.subRace?.id === action.payload.subRaceId)?.regions?.filter((region) => region.id !== action.payload.subObjectId);
            state.page.data!.find((subRace) => subRace.subRace?.id === action.payload.subRaceId)!.regions = regions;
        },
    }
}
)

export const { setSubRacePage, fillSubRaceData, addSubRace, removeSubRace, updateSubRace,
    addSubRaceDescription, removeSubRaceDescription, updateSubRaceDescription,
    addImageToSubRace, removeImageFromSubRace,
    removeRaceFromSubRace, setRaceToSubRace,
    removeRegionFromSubRace, addNewRegionToSubRace } = subRacePageSlice.actions;
export default subRacePageSlice.reducer;