
import { Dispatch } from "@reduxjs/toolkit"
import { useLocation, useNavigate } from "react-router-dom"
import { ApiError, DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO, WorldControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addImageToWorld, addWorldDescription, removeImageFromWorld, removeWorldDescription, setWorld, updateWorldDescription, updateWorld } from "./store/oneWorldSlice"
import { GlobalDescriptionFunction } from "../../../../globalFunctions/GlobalDescriptionFunction"

const actionDispatch = (dispatch: Dispatch) => ({
    setWorld: (world: EntryFullDTO) => {
        dispatch(setWorld(world))
    },
    updateWorld: (world: EntryDTO) => {
        dispatch(updateWorld(world))
    },

    addNewStateWorldDescription: (descriptionDTO: DescriptionDTO) => {
        dispatch(addWorldDescription(descriptionDTO))
    },
    updateStateWorldDescription: (descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updateWorldDescription({ descriptionId, descriptionDTO }))
    },
    removeStateWorldDescription: (descriptionId: number) => {
        dispatch(removeWorldDescription(descriptionId))
    },

    addImageToWorld: (imageDTO: ImageDTO) => {
        dispatch(addImageToWorld(imageDTO))
    },
    removeImageFromWorld: (imageId: number) => {
        dispatch(removeImageFromWorld(imageId))
    },
})

export function UseOneWorldObjectFunction() {
    const { setWorld, addImageToWorld, removeImageFromWorld, updateWorld, addNewStateWorldDescription, updateStateWorldDescription, removeStateWorldDescription } = actionDispatch(useAppDispatch());
    const { updateDescription } = GlobalDescriptionFunction({ updateOneEntryDescription: updateStateWorldDescription })
    const navigate = useNavigate();
    const location = useLocation();
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

    const editWorld = async (id: number, name: string, shortDescription: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return WorldControllerService.updateWorld(id, entryDTO)
            .then((_) => {
                updateWorld(entryDTO)
                if (location.pathname !== "/worlds/" + name) navigate('/worlds/' + name);
            })
            .catch((err) => {
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
            .then((res) => addNewStateWorldDescription(res))
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
            .then((res) => removeStateWorldDescription(descriptionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToWorld = async (acceptedFiles: Blob, id: number) => {
        return WorldControllerService.saveImageToWorld(id, { image: acceptedFiles })
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

    return { fetchWorld, removeWorld, editWorld, saveImageToWorld, deleteImageFromWorld, addNewDesctiptionToWorld, updateWorldDescription, deleteDescriptionFromWorld };
}