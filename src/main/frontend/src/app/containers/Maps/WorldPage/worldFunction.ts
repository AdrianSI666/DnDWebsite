
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, WorldControllerService, EntryDTO, ImageDTO, DescriptionDTO } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { addImageToWorld, removeWorld, removeImageFromWorld, updateWorld, addWorldDescription, updateWorldDescription, removeWorldDescription } from "./store/worldPageSlice";
import { GlobalDescriptionFunction } from "../../../globalFunctions/GlobalDescriptionFunction";

const actionDispatch = (dispatch: Dispatch) => ({
    removeWorld: (id: number) => {
        dispatch(removeWorld(id))
    },
    updateWorld: (id: number, entryDTO: EntryDTO) => {
        dispatch(updateWorld({ id, entryDTO }))
    },

    addNewStateWorldDescription: (id: number, descriptionDTO: DescriptionDTO) => {
        dispatch(addWorldDescription({ worldId: id, descriptionDTO }))
    },
    updateStateWorldDescription: (worldId: number, descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updateWorldDescription({ worldId, descriptionId, descriptionDTO }))
    },
    removeStateWorldDescription: (worldId: number, descriptionId: number) => {
        dispatch(removeWorldDescription({ worldId, subObjectId: descriptionId }))
    },

    addImageToWorld: (imageDTO: ImageDTO, worldId: number) => {
        let payload = {
            worldId,
            imageDTO
        }
        dispatch(addImageToWorld(payload))
    },
    removeImageFromWorld: (imageId: number, worldId: number) => {
        dispatch(removeImageFromWorld({
            worldId,
            subObjectId: imageId
        }))
    },
})

export function WorldFunction() {
    const { removeWorld, addImageToWorld, removeImageFromWorld, updateWorld, addNewStateWorldDescription, updateStateWorldDescription, removeStateWorldDescription } = actionDispatch(useAppDispatch());
    const { updateDescription } = GlobalDescriptionFunction({ updateDescription: updateStateWorldDescription })
    
    async function deleteWorld(id: number): Promise<void> {
        return WorldControllerService.deleteWorld(id)
            .then(() => removeWorld(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editWorld = async (id: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return WorldControllerService.updateWorld(id, entryDTO)
            .then(() => {
                updateWorld(id, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function addNewDesctiptionToWorld(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return WorldControllerService.saveDescriptionToWorld(id, descriptionDTO)
            .then((res) => addNewStateWorldDescription(id, res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updateWorldDescription(worldId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescription(worldId, descriptionId, descriptionDTO);
    }

    async function deleteDescriptionFromWorld(worldId: number, descriptionId: number) {
        return WorldControllerService.deleteDescriptionFromWorld(worldId, descriptionId)
            .then((_) => removeStateWorldDescription(worldId, descriptionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToWorld(acceptedFiles: Blob, id: number) {
        return WorldControllerService.saveImageToWorld(id, { image: acceptedFiles })
            .then((res) => addImageToWorld(res, id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function deleteImageFromWorld(worldId: number, imageId: number): Promise<void> {
        return WorldControllerService.deleteImageFromWorld(worldId, imageId)
            .then(() => removeImageFromWorld(imageId, worldId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { deleteWorld, editWorld, saveImageToWorld, deleteImageFromWorld, addNewDesctiptionToWorld, updateWorldDescription, deleteDescriptionFromWorld };
}