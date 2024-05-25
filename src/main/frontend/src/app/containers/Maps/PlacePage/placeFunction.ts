
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, PlaceControllerService, EntryDTO, ImageDTO } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { addImageToPlace, removePlace, removeImageFromPlace, updatePlace } from "./store/placePageSlice";

interface IPlaceFunction {
    placeId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    removePlace: (id: number) => {
        dispatch(removePlace(id))
    },
    updatePlace: (id: number, entryDTO: EntryDTO) => {
        dispatch(updatePlace({ id, entryDTO }))
    },
    addImageToPlace: (imageDTO: ImageDTO, placeId: number) => {
        let payload = {
            placeId,
            imageDTO
        }
        dispatch(addImageToPlace(payload))
    },
    removeImageFromPlace: (imageId: number, placeId: number) => {
        dispatch(removeImageFromPlace({
            placeId,
            imageId
        }))
    },
})

export function PlaceFunction(props: IPlaceFunction) {
    const { removePlace, addImageToPlace, removeImageFromPlace, updatePlace } = actionDispatch(useAppDispatch());
    async function deletePlace(id: number): Promise<void> {
        return PlaceControllerService.deletePlace(id)
            .then(() => removePlace(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editPlace = async (id: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return PlaceControllerService.updatePlace(id, entryDTO)
            .then(() => {
                updatePlace(id, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToPlace(acceptedFiles: Blob) {
        return PlaceControllerService.saveImageToPlace(props.placeId!, { image: acceptedFiles })
            .then((res) => addImageToPlace(res, props.placeId!))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function deleteImageFromPlace(placeId: number, imageId: number): Promise<void> {
        return PlaceControllerService.deleteImageFromPlace(placeId, imageId)
            .then(() => removeImageFromPlace(imageId, placeId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { deletePlace, editPlace, saveImageToPlace, deleteImageFromPlace };
}