
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, CultureControllerService, EntryDTO, ImageDTO } from "../../../services/openapi";
import { useAppDispatch } from "../../hooks";
import { addImageToCulture, removeCulture, removeImageFromCulture, updateCulture } from "./store/culturePageSlice";

interface ICultureFunction {
    cultureId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    removeCulture: (id: number) => {
        dispatch(removeCulture(id))
    },
    updateCulture: (id: number, entryDTO: EntryDTO) => {
        dispatch(updateCulture({ id, entryDTO }))
    },
    addImageToCulture: (imageDTO: ImageDTO, cultureId: number) => {
        let payload = {
            cultureId,
            imageDTO
        }
        dispatch(addImageToCulture(payload))
    },
    removeImageFromCulture: (imageId: number, cultureId: number) => {
        dispatch(removeImageFromCulture({
            cultureId,
            imageId
        }))
    },
})

export function CultureFunction(props: ICultureFunction) {
    const { removeCulture, addImageToCulture, removeImageFromCulture, updateCulture } = actionDispatch(useAppDispatch());
    async function deleteCulture(id: number): Promise<void> {
        return CultureControllerService.deleteCulture(id)
            .then(() => removeCulture(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editCulture = async (id: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return CultureControllerService.updateCulture(id, entryDTO)
            .then(() => {
                updateCulture(id, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToCulture(acceptedFiles: Blob) {
        return CultureControllerService.saveImageToCulture(props.cultureId!, { image: acceptedFiles })
            .then((res) => addImageToCulture(res, props.cultureId!))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function deleteImageFromCulture(cultureId: number, imageId: number): Promise<void> {
        return CultureControllerService.deleteImageFromCulture(cultureId, imageId)
            .then(() => removeImageFromCulture(imageId, cultureId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { deleteCulture, editCulture, saveImageToCulture, deleteImageFromCulture };
}