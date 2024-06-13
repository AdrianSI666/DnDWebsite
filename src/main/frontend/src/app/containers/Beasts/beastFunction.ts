
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, DescriptionDTO, EntryDTO, ImageDTO, BeastControllerService } from "../../../services/openapi"
import { useAppDispatch } from "../../hooks"
import {  setBeastPage, fillBeastData, addBeast, removeBeast, updateBeast,
    addBeastDescription, updateBeastDescription, removeBeastDescription,
     addImageToBeast, removeImageFromBeast,
     addNewRegionToBeast, removeRegionFromBeast  } from "./store/beastPageSlice"
import { GlobalDescriptionFunction } from "../../globalFunctions/GlobalDescriptionFunction"

const actionDispatch = (dispatch: Dispatch) => ({
    removeBeast: (id: number) => {
        dispatch(removeBeast(id))
    },
    updateBeast: (id: number, entryDTO: EntryDTO) => {
        dispatch(updateBeast({ id, entryDTO }))
    },

    addNewStateBeastDescription: (id: number, descriptionDTO: DescriptionDTO) => {
        dispatch(addBeastDescription({ beastId: id, descriptionDTO }))
    },
    updateStateBeastDescription: (beastId: number, descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updateBeastDescription({ beastId, descriptionId, descriptionDTO }))
    },
    removeStateBeastDescription: (beastId: number, descriptionId: number) => {
        dispatch(removeBeastDescription({ beastId, subObjectId: descriptionId }))
    },

    addImageToBeast: (imageDTO: ImageDTO, beastId: number) => {
        let payload = {
            beastId,
            imageDTO
        }
        dispatch(addImageToBeast(payload))
    },
    removeImageFromBeast: (imageId: number, beastId: number) => {
        dispatch(removeImageFromBeast({
            beastId,
            subObjectId: imageId
        }))
    },

})

export function BeastFunction() {
    const { removeBeast, updateBeast, addImageToBeast, removeImageFromBeast, addNewStateBeastDescription, updateStateBeastDescription, removeStateBeastDescription } = actionDispatch(useAppDispatch());
    const { updateDescription } = GlobalDescriptionFunction({ updateDescription: updateStateBeastDescription })

    async function deleteBeast(id: number): Promise<void> {
        return BeastControllerService.deleteBeast(id)
            .then(() => removeBeast(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editBeast = async (id: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return BeastControllerService.updateBeast(id, entryDTO)
            .then(() => {
                updateBeast(id, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function addNewDesctiptionToBeast(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return BeastControllerService.saveDescriptionToBeast(id, descriptionDTO)
            .then((res) => addNewStateBeastDescription(id, res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updateBeastDescription(beastId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescription(beastId, descriptionId, descriptionDTO);
    }

    async function deleteDescriptionFromBeast(beastId: number, descriptionId: number) {
        return BeastControllerService.deleteDescriptionFromBeast(beastId, descriptionId)
            .then((_) => removeStateBeastDescription(beastId, descriptionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToBeast(acceptedFiles: Blob, beastId: number) {
        return BeastControllerService.saveImageToBeast(beastId!, { image: acceptedFiles })
            .then((res) => addImageToBeast(res, beastId!))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function deleteImageFromBeast(beastId: number, imageId: number): Promise<void> {
        return BeastControllerService.deleteImageFromBeast(beastId, imageId)
            .then(() => removeImageFromBeast(imageId, beastId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return {
        deleteBeast, editBeast,
        addNewDesctiptionToBeast, updateBeastDescription, deleteDescriptionFromBeast,
        saveImageToBeast, deleteImageFromBeast
    };
}