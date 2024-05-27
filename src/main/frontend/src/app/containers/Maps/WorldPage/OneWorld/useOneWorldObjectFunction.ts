
import { Dispatch } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom"
import { ApiError, EntryDTO, EntryFullDTO, ImageDTO, WorldControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addImageToWorld, removeImageFromWorld, setWorld, updateWorld } from "./store/oneWorldSlice"

interface IUseOneWorldObjectFunction {
    worldId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    setWorld: (world: EntryFullDTO) => {
        dispatch(setWorld(world))
    },
    updateWorld: (world: EntryDTO) => {
        dispatch(updateWorld(world))
    },
    addImageToWorld: (imageDTO: ImageDTO) => {
        dispatch(addImageToWorld(imageDTO))
    },
    removeImageFromWorld: (imageId: number) => {
        dispatch(removeImageFromWorld(imageId))
    },
})

export function UseOneWorldObjectFunction(props: IUseOneWorldObjectFunction) {
    const { setWorld, addImageToWorld, removeImageFromWorld, updateWorld } = actionDispatch(useAppDispatch());
    const navigate = useNavigate();
    const fetchWorld = async (name: string): Promise<boolean> => {
        return WorldControllerService.getWorldByName(name)
            .then((response) => {
                setWorld(response)
                return true
            })
            .catch((_) => {
                return false
            })
    }

    const removeWorld = async (id: number) => {
        return WorldControllerService.deleteWorld(id)
            .then((_) => {
                navigate("/Worlds")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editWorld = async (id: number, name: string, description: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return WorldControllerService.updateWorld(id, entryDTO)
            .then((_) => {
                updateWorld(entryDTO)
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToWorld = async (acceptedFiles: Blob) => {
        return WorldControllerService.saveImageToWorld(props.worldId!, { image: acceptedFiles })
            .then((res) => addImageToWorld(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const deleteImageFromWorld = async (worldId: number, imageId: number) => {
        return WorldControllerService.deleteImageFromWorld(worldId, imageId)
            .then(() => removeImageFromWorld(imageId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { fetchWorld, removeWorld, editWorld, saveImageToWorld, deleteImageFromWorld };
}