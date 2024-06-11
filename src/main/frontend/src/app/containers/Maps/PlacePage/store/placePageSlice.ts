import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPlacePageState } from "../types";
import { DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO, Page } from "../../../../../services/openapi";

const initialState: IPlacePageState = {
    page: {
        currentPage: 1,
        totalPages: 1,
        data: new Array<EntryFullDTO>()
    }
}

interface IUpdatePlacePayload {
    id: number,
    entryDTO: EntryDTO
}

interface IAddDescriptionPayload {
    placeId: number,
    descriptionDTO: DescriptionDTO
}

interface IUpdateDescriptionPayload {
    placeId: number,
    descriptionId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    placeId: number,
    imageDTO: ImageDTO
}

interface IRemoveSubObjectPayload {
    placeId: number,
    subObjectId: number
}

interface ISetNewDomObjectPayload {
    placeId: number,
    regionDTO: EntryDTO
}

const placePageSlice = createSlice({
    name: "PlacePage",
    initialState,
    reducers: {
        setPlacePage(state, action: PayloadAction<Page<EntryFullDTO>>) {
            state.page.currentPage = action.payload.currentPage;
            state.page.totalPages = action.payload.totalPages;
            state.page.data = action.payload.data;
        },
        fillPlaceData(state, action: PayloadAction<EntryFullDTO>) {
            state.page.data?.splice(
                state.page.data?.findIndex((place) => place.object?.id === action.payload.object?.id),
                1,
                action.payload);
        },
        addPlace(state, action: PayloadAction<EntryFullDTO>) {
            state.page.data?.unshift(action.payload);
        },
        removePlace(state, action: PayloadAction<number>) {
            state.page.data = state.page.data?.filter((place) => place.object?.id !== action.payload);
        },
        updatePlace(state, action: PayloadAction<IUpdatePlacePayload>) {
            state.page.data!.at(
                state.page.data!.findIndex((place) => place.object?.id === action.payload.id))!
                .object = action.payload.entryDTO;
        },

        addPlaceDescription(state, action: PayloadAction<IAddDescriptionPayload>) {
            state.page.data?.at(
                state.page.data!.findIndex((place) => place.object?.id === action.payload.placeId))!
                .descriptions?.push(action.payload.descriptionDTO);
        },
        updatePlaceDescription(state, action: PayloadAction<IUpdateDescriptionPayload>) {
            state.page.data!.at( state.page.data!.findIndex((place) => place.object?.id === action.payload.placeId))!.descriptions = 
            state.page.data?.at(
                state.page.data!.findIndex((place) => place.object?.id === action.payload.placeId))!
                .descriptions?.map((description) => {
                    if(description.id === action.payload.descriptionId) {
                        return action.payload.descriptionDTO;
                    }
                    return description;
                });
        },
        removePlaceDescription(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let descriptions = state.page.data?.at(state.page.data!.findIndex((place) => place.object?.id === action.payload.placeId))!.descriptions;
            state.page.data!.at(state.page.data!.findIndex((place) => place.object?.id === action.payload.placeId))!.descriptions = descriptions?.filter((description) => description.id !== action.payload.subObjectId);
        },

        addImageToPlace(state, action: PayloadAction<IAddImagePayload>) {
            state.page.data?.at(
                state.page.data.findIndex((place) => place.object?.id === action.payload.placeId))!
                .images?.push(action.payload.imageDTO);
        },
        removeImageFromPlace(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let images = state.page.data?.at(state.page.data.findIndex((place) => place.object?.id === action.payload.placeId))!.images;
            state.page.data!.at(state.page.data!.findIndex((place) => place.object?.id === action.payload.placeId))!.images = images?.filter((image) => image.id !== action.payload.subObjectId);
        },
        
        setRegionToPlace(state, action: PayloadAction<ISetNewDomObjectPayload>) {
            state.page.data!.find((place) => place.object?.id === action.payload.placeId)!.domObjects = action.payload.regionDTO;
        },
        removeRegionFromPlace(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            state.page.data!.find((place) => place.object?.id === action.payload.placeId)!.domObjects = undefined;
        }
    }
}
)

export const { setPlacePage, fillPlaceData, addPlace, removePlace, updatePlace,
    addPlaceDescription, updatePlaceDescription, removePlaceDescription,
    addImageToPlace, removeImageFromPlace,
    setRegionToPlace, removeRegionFromPlace } = placePageSlice.actions;
export default placePageSlice.reducer;