
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, CultureControllerService, DescriptionDTO, EntryDTO, ImageDTO } from "../../../services/openapi";
import { useAppDispatch } from "../../hooks";
import { addCultureDescription, addImageToCulture, removeCulture, removeCultureDescription, removeImageFromCulture, updateCulture, updateCultureDescription } from "./store/culturePageSlice";
import { GlobalDescriptionFunction } from "../../globalFunctions/GlobalDescriptionFunction";

const actionDispatch = (dispatch: Dispatch) => ({
    removeCulture: (id: number) => {
        dispatch(removeCulture(id))
    },
    updateCulture: (id: number, entryDTO: EntryDTO) => {
        dispatch(updateCulture({ id, entryDTO }))
    },

    addNewStateCultureDescription: (id: number, descriptionDTO: DescriptionDTO) => {
        dispatch(addCultureDescription({cultureId: id, descriptionDTO}))
    },
    updateStateCultureDescription: (cultureId: number, descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updateCultureDescription({cultureId, descriptionId, descriptionDTO}))
    },
    removeStateCultureDescription: (cultureId: number, descriptionId: number) => {
        dispatch(removeCultureDescription({cultureId, descriptionId}))
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

export function CultureFunction() {
    const { removeCulture, addImageToCulture, removeImageFromCulture, updateCulture, addNewStateCultureDescription, updateStateCultureDescription, removeStateCultureDescription } = actionDispatch(useAppDispatch());
    const {updateDescription} = GlobalDescriptionFunction({updateDescription: updateStateCultureDescription})
    async function deleteCulture(id: number): Promise<void> {
        return CultureControllerService.deleteCulture(id)
            .then(() => removeCulture(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editCulture = async (id: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
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

    async function addNewDesctiptionToCulture(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return CultureControllerService.saveDescriptionToCulture(id, descriptionDTO)
            .then((res) => addNewStateCultureDescription(id, res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updateCultureDescription(cultureId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescription(cultureId, descriptionId, descriptionDTO);
    }

    async function deleteDescriptionFromCulture(cultureId: number, descriptionId: number) {
        return CultureControllerService.deleteDescriptionFromCulture(cultureId, descriptionId)
            .then((_) => removeStateCultureDescription(cultureId, descriptionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToCulture(acceptedFiles: Blob, cultureId: number) {
        return CultureControllerService.saveImageToCulture(cultureId, { image: acceptedFiles })
            .then((res) => addImageToCulture(res, cultureId))
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

    return { deleteCulture, editCulture, 
        saveImageToCulture, deleteImageFromCulture, 
        addNewDesctiptionToCulture, updateCultureDescription, deleteDescriptionFromCulture };
}