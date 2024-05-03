
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, ContinentControllerService, EntryDTO, ImageDTO } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { addImageToContinent, removeContinent, removeImageFromContinent, updateContinent } from "./store/continentPageSlice";

interface IContinentFunction {
    continentId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    removeContinent: (id: number) => {
        dispatch(removeContinent(id))
    },
    updateContinent: (id: number, entryDTO: EntryDTO) => {
        dispatch(updateContinent({ id, entryDTO }))
    },
    addImageToContinent: (imageDTO: ImageDTO, continentId: number) => {
        let payload = {
            continentId,
            imageDTO
        }
        dispatch(addImageToContinent(payload))
    },
    removeImageFromContinent: (imageId: number, continentId: number) => {
        dispatch(removeImageFromContinent({
            continentId,
            imageId
        }))
    },
})

export function ContinentFunction(props: IContinentFunction) {
    const { removeContinent, addImageToContinent, removeImageFromContinent, updateContinent } = actionDispatch(useAppDispatch());
    async function deleteContinent(id: number): Promise<void> {
        return ContinentControllerService.deleteContinent(id)
            .then(() => removeContinent(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editContinent = async (id: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return ContinentControllerService.updateContinent(id, entryDTO)
            .then(() => {
                updateContinent(id, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToContinent(acceptedFiles: Blob) {
        return ContinentControllerService.saveImageToContinent(props.continentId!, { image: acceptedFiles })
            .then((res) => addImageToContinent(res, props.continentId!))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function deleteImageFromContinent(continentId: number, imageId: number): Promise<void> {
        return ContinentControllerService.deleteImageFromContinent(continentId, imageId)
            .then(() => removeImageFromContinent(imageId, continentId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { deleteContinent, editContinent, saveImageToContinent, deleteImageFromContinent };
}