
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, ContinentControllerService, DescriptionDTO, EntryDTO, ImageDTO } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { addContinentDescription, addImageToContinent, removeContinent, removeContinentDescription, removeImageFromContinent, updateContinent, updateContinentDescription } from "./store/continentPageSlice";
import { GlobalDescriptionFunction } from "../../../globalFunctions/GlobalDescriptionFunction";

const actionDispatch = (dispatch: Dispatch) => ({
    removeContinent: (id: number) => {
        dispatch(removeContinent(id))
    },
    updateContinent: (id: number, entryDTO: EntryDTO) => {
        dispatch(updateContinent({ id, entryDTO }))
    },

    addNewStateContinentDescription: (id: number, descriptionDTO: DescriptionDTO) => {
        dispatch(addContinentDescription({ continentId: id, descriptionDTO }))
    },
    updateStateContinentDescription: (continentId: number, descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updateContinentDescription({ continentId, descriptionId, descriptionDTO }))
    },
    removeStateContinentDescription: (continentId: number, descriptionId: number) => {
        dispatch(removeContinentDescription({ continentId, subObjectId: descriptionId }))
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
            subObjectId: imageId
        }))
    },
})

export function ContinentFunction() {
    const { removeContinent, addImageToContinent, removeImageFromContinent, updateContinent, addNewStateContinentDescription, updateStateContinentDescription, removeStateContinentDescription } = actionDispatch(useAppDispatch());
    const { updateDescription } = GlobalDescriptionFunction({ updateDescription: updateStateContinentDescription })
    async function deleteContinent(id: number): Promise<void> {
        return ContinentControllerService.deleteContinent(id)
            .then(() => removeContinent(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editContinent = async (id: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
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

    async function addNewDesctiptionToContinent(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return ContinentControllerService.saveDescriptionToContinent(id, descriptionDTO)
            .then((res) => addNewStateContinentDescription(id, res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updateContinentDescription(worldId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescription(worldId, descriptionId, descriptionDTO);
    }

    async function deleteDescriptionFromContinent(worldId: number, descriptionId: number) {
        return ContinentControllerService.deleteDescriptionFromContinent(worldId, descriptionId)
            .then((_) => removeStateContinentDescription(worldId, descriptionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToContinent(acceptedFiles: Blob, id: number) {
        return ContinentControllerService.saveImageToContinent(id, { image: acceptedFiles })
            .then((res) => addImageToContinent(res, id))
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

    return { deleteContinent, editContinent, saveImageToContinent, deleteImageFromContinent, addNewDesctiptionToContinent, deleteDescriptionFromContinent, updateContinentDescription };
}