
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, PlaneControllerService, EntryDTO, ImageDTO, DescriptionDTO } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { addImageToPlane, removePlane, removeImageFromPlane, updatePlane, addPlaneDescription, updatePlaneDescription, removePlaneDescription } from "./store/planePageSlice";
import { GlobalDescriptionFunction } from "../../../globalFunctions/GlobalDescriptionFunction";

const actionDispatch = (dispatch: Dispatch) => ({
    removePlane: (id: number) => {
        dispatch(removePlane(id))
    },
    updatePlane: (id: number, entryDTO: EntryDTO) => {
        dispatch(updatePlane({ id, entryDTO }))
    },

    addNewStatePlaneDescription: (id: number, descriptionDTO: DescriptionDTO) => {
        dispatch(addPlaneDescription({ planeId: id, descriptionDTO }))
    },
    updateStatePlaneDescription: (planeId: number, descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updatePlaneDescription({ planeId, descriptionId, descriptionDTO }))
    },
    removeStatePlaneDescription: (planeId: number, descriptionId: number) => {
        dispatch(removePlaneDescription({ planeId, subObjectId: descriptionId }))
    },

    addImageToPlane: (imageDTO: ImageDTO, planeId: number) => {
        let payload = {
            planeId,
            imageDTO
        }
        dispatch(addImageToPlane(payload))
    },
    removeImageFromPlane: (imageId: number, planeId: number) => {
        dispatch(removeImageFromPlane({
            planeId,
            subObjectId: imageId
        }))
    },
})

export function PlaneFunction() {
    const { removePlane, addImageToPlane, removeImageFromPlane, updatePlane, addNewStatePlaneDescription, updateStatePlaneDescription, removeStatePlaneDescription } = actionDispatch(useAppDispatch());
    const { updateDescription } = GlobalDescriptionFunction({ updateDescription: updateStatePlaneDescription })
    async function deletePlane(id: number): Promise<void> {
        return PlaneControllerService.deletePlane(id)
            .then(() => removePlane(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editPlane = async (id: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return PlaneControllerService.updatePlane(id, entryDTO)
            .then(() => {
                updatePlane(id, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function addNewDesctiptionToPlane(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return PlaneControllerService.saveDescriptionToPlane(id, descriptionDTO)
            .then((res) => addNewStatePlaneDescription(id, res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updatePlaneDescription(worldId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescription(worldId, descriptionId, descriptionDTO);
    }

    async function deleteDescriptionFromPlane(worldId: number, descriptionId: number) {
        return PlaneControllerService.deleteDescriptionFromPlane(worldId, descriptionId)
            .then((_) => removeStatePlaneDescription(worldId, descriptionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToPlane(acceptedFiles: Blob, id: number) {
        return PlaneControllerService.saveImageToPlane(id, { image: acceptedFiles })
            .then((res) => addImageToPlane(res, id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function deleteImageFromPlane(planeId: number, imageId: number): Promise<void> {
        return PlaneControllerService.deleteImageFromPlane(planeId, imageId)
            .then(() => removeImageFromPlane(imageId, planeId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { deletePlane, editPlane,
        addNewDesctiptionToPlane, deleteDescriptionFromPlane, updatePlaneDescription,
        saveImageToPlane, deleteImageFromPlane };
}