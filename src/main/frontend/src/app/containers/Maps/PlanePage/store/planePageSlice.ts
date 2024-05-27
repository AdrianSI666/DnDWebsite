import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPlanePageState } from "../types";
import { EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../services/openapi";
import { Page } from "../../../../../services/openapi/models/Page";

const initialState: IPlanePageState = {
    page: {
        currentPage: 1,
        totalPages: 1,
        data: new Array<EntryFullDTO>()
    }
}

interface IUpdatePlanePayload {
    id: number,
    entryDTO: EntryDTO
}

interface IAddImagePayload {
    planeId: number,
    imageDTO: ImageDTO
}

interface IRemoveImagePayload {
    planeId: number,
    imageId: number
}

interface IAddNewSubObjectPayload {
    planeId: number,
    continentDTO: EntryDTO
}

interface IRemoveSubObjectPayload {
    planeId: number,
    subObjectId: number
}

interface ISetNewDomObjectPayload {
    planeId: number,
    worldDTO: EntryDTO
}

const planePageSlice = createSlice({
    name: "PlanePage",
    initialState,
    reducers: {
        setPlanePage(state, action: PayloadAction<Page<EntryFullDTO>>) {
            state.page.currentPage = action.payload.currentPage;
            state.page.totalPages = action.payload.totalPages;
            state.page.data = action.payload.data;
        },
        fillPlaneData(state, action: PayloadAction<EntryFullDTO>) {
            state.page.data?.splice(
                state.page.data?.findIndex((plane) => plane.object?.id === action.payload.object?.id),
                1,
                action.payload);
        },
        addPlane(state, action: PayloadAction<EntryFullDTO>) {
            state.page.data?.unshift(action.payload);
        },
        removePlane(state, action: PayloadAction<number>) {
            console.log(action)
            state.page.data = state.page.data?.filter((plane) => plane.object?.id !== action.payload);
        },
        updatePlane(state, action: PayloadAction<IUpdatePlanePayload>) {
            console.log(action)
            state.page.data!.at(
                state.page.data!.findIndex((plane) => plane.object?.id === action.payload.id))!
                .object = action.payload.entryDTO;
        },
        addImageToPlane(state, action: PayloadAction<IAddImagePayload>) {
            state.page.data?.at(
                state.page.data.findIndex((plane) => plane.object?.id === action.payload.planeId))!
                .images?.push(action.payload.imageDTO);
        },
        removeImageFromPlane(state, action: PayloadAction<IRemoveImagePayload>) {
            let images = state.page.data?.at(state.page.data.findIndex((plane) => plane.object?.id === action.payload.planeId))!.images;
            state.page.data!.at(state.page.data!.findIndex((plane) => plane.object?.id === action.payload.planeId))!.images = images?.filter((image) => image.id !== action.payload.imageId);
        },
        addNewContinentToPlane(state, action: PayloadAction<IAddNewSubObjectPayload>) {
            state.page.data?.at(
                state.page.data.findIndex((plane) => plane.object?.id === action.payload.planeId))!
                .subObjects?.push(action.payload.continentDTO);
        },
        removeContinentFromPlane(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let subPlanes = state.page.data!.find((plane) => plane.object?.id === action.payload.planeId)?.subObjects?.filter((continent) => continent.id !== action.payload.subObjectId);
            state.page.data!.find((plane) => plane.object?.id === action.payload.planeId)!.subObjects = subPlanes;
        },
        setWorldToPlane(state, action: PayloadAction<ISetNewDomObjectPayload>) {
            state.page.data!.find((plane) => plane.object?.id === action.payload.planeId)!.domObjects = action.payload.worldDTO;
        },
        removeWorldFromPlane(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            state.page.data!.find((plane) => plane.object?.id === action.payload.planeId)!.domObjects = undefined;
        },
    }
}
)

export const { setPlanePage, fillPlaneData, addPlane, removePlane, updatePlane, addImageToPlane, removeImageFromPlane, addNewContinentToPlane, removeContinentFromPlane, setWorldToPlane, removeWorldFromPlane } = planePageSlice.actions;
export default planePageSlice.reducer;