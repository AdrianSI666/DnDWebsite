import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPlacePageState } from "../types";
import { EntryDTO, EntryFullDTO, ImageDTO, Page } from "../../../../../services/openapi";

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

interface IAddImagePayload {
    placeId: number,
    imageDTO: ImageDTO
}

interface IRemoveImagePayload {
    placeId: number,
    imageId: number
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

        addImageToPlace(state, action: PayloadAction<IAddImagePayload>) {
            state.page.data?.at(
                state.page.data.findIndex((place) => place.object?.id === action.payload.placeId))!
                .images?.push(action.payload.imageDTO);
        },
        removeImageFromPlace(state, action: PayloadAction<IRemoveImagePayload>) {
            let images = state.page.data?.at(state.page.data.findIndex((place) => place.object?.id === action.payload.placeId))!.images;
            state.page.data!.at(state.page.data!.findIndex((place) => place.object?.id === action.payload.placeId))!.images = images?.filter((image) => image.id !== action.payload.imageId);
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

export const { setPlacePage, fillPlaceData, addPlace, removePlace, updatePlace, addImageToPlace, removeImageFromPlace,setRegionToPlace, removeRegionFromPlace } = placePageSlice.actions;
export default placePageSlice.reducer;