import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IWorldPageState } from "../types";
import { EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../services/openapi";
import { Page } from "../../../../../services/openapi/models/Page";

const initialState: IWorldPageState = {
    page: {
        currentPage: 1,
        totalPages: 1,
        data: new Array<EntryFullDTO>()
    }
}

interface IUpdateWorldPayload {
    id: number,
    entryDTO: EntryDTO
}

interface IAddImagePayload {
    worldId: number,
    imageDTO: ImageDTO
}

interface IRemoveImagePayload {
    worldId: number,
    imageId: number
}

interface IAddNewSubObjectPayload {
    worldId: number,
    planeDTO: EntryDTO
}

interface IRemoveSubObjectPayload {
    worldId: number,
    planeId: number
}

const worldPageSlice = createSlice({
    name: "WorldPage",
    initialState,
    reducers: {
        setWorldPage(state, action: PayloadAction<Page<EntryFullDTO>>) {
            state.page.currentPage = action.payload.currentPage;
            state.page.totalPages = action.payload.totalPages;
            state.page.data = action.payload.data;
        },
        fillWorldData(state, action: PayloadAction<EntryFullDTO>) {
            state.page.data?.splice(
                state.page.data?.findIndex((world) => world.object?.id === action.payload.object?.id),
                1,
                action.payload);
        },
        addWorld(state, action: PayloadAction<EntryFullDTO>) {
            state.page.data?.unshift(action.payload);
        },
        removeWorld(state, action: PayloadAction<number>) {
            console.log(action)
            state.page.data = state.page.data?.filter((world) => world.object?.id !== action.payload);
        },
        updateWorld(state, action: PayloadAction<IUpdateWorldPayload>) {
            console.log(action)
            state.page.data!.at(
                state.page.data!.findIndex((world) => world.object?.id === action.payload.id))!
                .object = action.payload.entryDTO;
        },
        addImageToWorld(state, action: PayloadAction<IAddImagePayload>) {
            state.page.data?.at(
                state.page.data.findIndex((world) => world.object?.id === action.payload.worldId))!
                .images?.push(action.payload.imageDTO);
        },
        removeImageFromWorld(state, action: PayloadAction<IRemoveImagePayload>) {
            let images = state.page.data?.at(state.page.data.findIndex((world) => world.object?.id === action.payload.worldId))!.images;
            state.page.data!.at(state.page.data!.findIndex((world) => world.object?.id === action.payload.worldId))!.images = images?.filter((image) => image.id !== action.payload.imageId);
        },
        addNewPlaneToWorld(state, action: PayloadAction<IAddNewSubObjectPayload>) {
            state.page.data?.at(
                state.page.data.findIndex((world) => world.object?.id === action.payload.worldId))!
                .subObjects?.push(action.payload.planeDTO);
        },
        removePlaneFromWorld(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let subWorlds = state.page.data!.find((world) => world.object?.id === action.payload.worldId)?.subObjects?.filter((plane) => plane.id !== action.payload.planeId);
            state.page.data!.find((world) => world.object?.id === action.payload.worldId)!.subObjects = subWorlds;
        }
    }
}
)

export const { setWorldPage, fillWorldData, addWorld, removeWorld, updateWorld, addImageToWorld, removeImageFromWorld, addNewPlaneToWorld, removePlaneFromWorld } = worldPageSlice.actions;
export default worldPageSlice.reducer;