import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IWorldPageState } from "../types";
import { DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../services/openapi";
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

interface IAddDescriptionPayload {
    worldId: number,
    descriptionDTO: DescriptionDTO
}

interface IUpdateDescriptionPayload {
    worldId: number,
    descriptionId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    worldId: number,
    imageDTO: ImageDTO
}

interface IAddNewSubObjectPayload {
    worldId: number,
    planeDTO: EntryDTO
}

interface IRemoveSubObjectPayload {
    worldId: number,
    subObjectId: number
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

        addWorldDescription(state, action: PayloadAction<IAddDescriptionPayload>) {
            state.page.data?.at(
                state.page.data!.findIndex((world) => world.object?.id === action.payload.worldId))!
                .descriptions?.push(action.payload.descriptionDTO);
        },
        updateWorldDescription(state, action: PayloadAction<IUpdateDescriptionPayload>) {
            state.page.data!.at( state.page.data!.findIndex((world) => world.object?.id === action.payload.worldId))!.descriptions = 
            state.page.data?.at(
                state.page.data!.findIndex((world) => world.object?.id === action.payload.worldId))!
                .descriptions?.map((description) => {
                    if(description.id === action.payload.descriptionId) {
                        return action.payload.descriptionDTO;
                    }
                    return description;
                });
        },
        removeWorldDescription(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let descriptions = state.page.data?.at(state.page.data!.findIndex((world) => world.object?.id === action.payload.worldId))!.descriptions;
            state.page.data!.at(state.page.data!.findIndex((world) => world.object?.id === action.payload.worldId))!.descriptions = descriptions?.filter((description) => description.id !== action.payload.subObjectId);
        },

        addImageToWorld(state, action: PayloadAction<IAddImagePayload>) {
            state.page.data?.at(
                state.page.data.findIndex((world) => world.object?.id === action.payload.worldId))!
                .images?.push(action.payload.imageDTO);
        },
        removeImageFromWorld(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let images = state.page.data?.at(state.page.data.findIndex((world) => world.object?.id === action.payload.worldId))!.images;
            state.page.data!.at(state.page.data!.findIndex((world) => world.object?.id === action.payload.worldId))!.images = images?.filter((image) => image.id !== action.payload.subObjectId);
        },

        addNewPlaneToWorld(state, action: PayloadAction<IAddNewSubObjectPayload>) {
            state.page.data?.at(
                state.page.data.findIndex((world) => world.object?.id === action.payload.worldId))!
                .subObjects?.push(action.payload.planeDTO);
        },
        removePlaneFromWorld(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let subWorlds = state.page.data!.find((world) => world.object?.id === action.payload.worldId)?.subObjects?.filter((plane) => plane.id !== action.payload.subObjectId);
            state.page.data!.find((world) => world.object?.id === action.payload.worldId)!.subObjects = subWorlds;
        }
    }
}
)

export const { setWorldPage, fillWorldData, addWorld, removeWorld, updateWorld,
    addWorldDescription, removeWorldDescription, updateWorldDescription,
    addImageToWorld, removeImageFromWorld,
    addNewPlaneToWorld, removePlaneFromWorld } = worldPageSlice.actions;
export default worldPageSlice.reducer;