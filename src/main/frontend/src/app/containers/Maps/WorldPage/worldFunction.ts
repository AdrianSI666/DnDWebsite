
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, WorldControllerService, EntryDTO, ImageDTO } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { addImageToWorld, removeWorld, removeImageFromWorld, updateWorld } from "./store/worldPageSlice";

interface IWorldFunction {
    worldId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    removeWorld: (id: number) => {
        dispatch(removeWorld(id))
    },
    updateWorld: (id: number, entryDTO: EntryDTO) => {
        dispatch(updateWorld({ id, entryDTO }))
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
            imageId
        }))
    },
})

export function WorldFunction(props: IWorldFunction) {
    const { removeWorld, addImageToWorld, removeImageFromWorld, updateWorld } = actionDispatch(useAppDispatch());
    async function deleteWorld(id: number): Promise<void> {
        return WorldControllerService.deleteWorld(id)
            .then(() => removeWorld(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editWorld = async (id: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
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

    async function saveImageToWorld(acceptedFiles: Blob) {
        return WorldControllerService.saveImageToWorld(props.worldId!, { image: acceptedFiles })
            .then((res) => addImageToWorld(res, props.worldId!))
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

    return { deleteWorld, editWorld, saveImageToWorld, deleteImageFromWorld };
}