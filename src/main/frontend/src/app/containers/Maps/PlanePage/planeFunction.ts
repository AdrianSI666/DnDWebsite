
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, PlaneControllerService, EntryDTO, ImageDTO } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { addImageToPlane, removePlane, removeImageFromPlane, updatePlane } from "./store/planePageSlice";

interface IPlaneFunction {
    planeId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    removePlane: (id: number) => {
        dispatch(removePlane(id))
    },
    updatePlane: (id: number, entryDTO: EntryDTO) => {
        dispatch(updatePlane({ id, entryDTO }))
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
            imageId
        }))
    },
})

export function PlaneFunction(props: IPlaneFunction) {
    const { removePlane, addImageToPlane, removeImageFromPlane, updatePlane } = actionDispatch(useAppDispatch());
    async function deletePlane(id: number): Promise<void> {
        return PlaneControllerService.deletePlane(id)
            .then(() => removePlane(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editPlane = async (id: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
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

    async function saveImageToPlane(acceptedFiles: Blob) {
        return PlaneControllerService.saveImageToPlane(props.planeId!, { image: acceptedFiles })
            .then((res) => addImageToPlane(res, props.planeId!))
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

    return { deletePlane, editPlane, saveImageToPlane, deleteImageFromPlane };
}