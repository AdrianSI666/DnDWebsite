
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, DescriptionDTO, EntryDTO, ImageDTO, SubRaceControllerService } from "../../../../services/openapi"
import { useAppDispatch } from "../../../hooks"
import { addImageToSubRace, removeImageFromSubRace, removeSubRace, updateSubRace, addSubRaceDescription, updateSubRaceDescription, removeSubRaceDescription } from "./store/subRacePageSlice"
import { GlobalDescriptionFunction } from "../../../globalFunctions/GlobalDescriptionFunction"

const actionDispatch = (dispatch: Dispatch) => ({
    removeSubRace: (id: number) => {
        dispatch(removeSubRace(id))
    },
    updateSubRace: (id: number, entryDTO: EntryDTO) => {
        dispatch(updateSubRace({ id, entryDTO }))
    },

    addNewStateSubRaceDescription: (id: number, descriptionDTO: DescriptionDTO) => {
        dispatch(addSubRaceDescription({ subRaceId: id, descriptionDTO }))
    },
    updateStateSubRaceDescription: (subRaceId: number, descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updateSubRaceDescription({ subRaceId, descriptionId, descriptionDTO }))
    },
    removeStateSubRaceDescription: (subRaceId: number, descriptionId: number) => {
        dispatch(removeSubRaceDescription({ subRaceId, subObjectId: descriptionId }))
    },

    addImageToSubRace: (imageDTO: ImageDTO, subRaceId: number) => {
        let payload = {
            subRaceId,
            imageDTO
        }
        dispatch(addImageToSubRace(payload))
    },
    removeImageFromSubRace: (imageId: number, subRaceId: number) => {
        dispatch(removeImageFromSubRace({
            subRaceId,
            subObjectId: imageId
        }))
    },

})

export function SubRaceFunction() {
    const { removeSubRace, updateSubRace, addImageToSubRace, removeImageFromSubRace, addNewStateSubRaceDescription, updateStateSubRaceDescription, removeStateSubRaceDescription } = actionDispatch(useAppDispatch());
    const { updateDescription } = GlobalDescriptionFunction({ updateDescription: updateStateSubRaceDescription })

    async function deleteSubRace(id: number): Promise<void> {
        return SubRaceControllerService.deleteSubRace(id)
            .then(() => removeSubRace(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editSubRace = async (id: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return SubRaceControllerService.updateSubRace(id, entryDTO)
            .then(() => {
                updateSubRace(id, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function addNewDesctiptionToSubRace(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return SubRaceControllerService.saveDescriptionToSubRace(id, descriptionDTO)
            .then((res) => addNewStateSubRaceDescription(id, res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updateSubRaceDescription(raceId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescription(raceId, descriptionId, descriptionDTO);
    }

    async function deleteDescriptionFromSubRace(raceId: number, descriptionId: number) {
        return SubRaceControllerService.deleteDescriptionFromSubRace(raceId, descriptionId)
            .then((_) => removeStateSubRaceDescription(raceId, descriptionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToSubRace(acceptedFiles: Blob, subRaceId: number) {
        return SubRaceControllerService.saveImageToSubRace(subRaceId, { image: acceptedFiles })
            .then((res) => addImageToSubRace(res, subRaceId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function deleteImageFromSubRace(subRaceId: number, imageId: number): Promise<void> {
        return SubRaceControllerService.deleteImageFromSubRace(subRaceId, imageId)
            .then(() => removeImageFromSubRace(imageId, subRaceId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return {
        deleteSubRace, editSubRace,
        addNewDesctiptionToSubRace, updateSubRaceDescription, deleteDescriptionFromSubRace,
        saveImageToSubRace, deleteImageFromSubRace
    };
}