
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, DescriptionDTO, EntryDTO, ImageDTO, RaceControllerService } from "../../../../services/openapi"
import { useAppDispatch } from "../../../hooks"
import { addImageToRace, addRaceDescription, removeImageFromRace, removeRace, removeRaceDescription, updateRace, updateRaceDescription } from "./store/racePageSlice"
import { GlobalDescriptionFunction } from "../../../globalFunctions/GlobalDescriptionFunction"

const actionDispatch = (dispatch: Dispatch) => ({
    removeRace: (id: number) => {
        dispatch(removeRace(id))
    },
    updateRace: (id: number, entryDTO: EntryDTO) => {
        dispatch(updateRace({ id, entryDTO }))
    },

    addNewStateRaceDescription: (id: number, descriptionDTO: DescriptionDTO) => {
        dispatch(addRaceDescription({ raceId: id, descriptionDTO }))
    },
    updateStateRaceDescription: (raceId: number, descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updateRaceDescription({ raceId, descriptionId, descriptionDTO }))
    },
    removeStateRaceDescription: (raceId: number, descriptionId: number) => {
        dispatch(removeRaceDescription({ raceId, subObjectId: descriptionId }))
    },

    addImageToRace: (imageDTO: ImageDTO, raceId: number) => {
        let payload = {
            raceId,
            imageDTO
        }
        dispatch(addImageToRace(payload))
    },
    removeImageFromRace: (imageId: number, raceId: number) => {
        dispatch(removeImageFromRace({
            raceId,
            subObjectId: imageId
        }))
    },

})

export function RaceFunction() {
    const { removeRace, updateRace, addImageToRace, removeImageFromRace, addNewStateRaceDescription, updateStateRaceDescription, removeStateRaceDescription } = actionDispatch(useAppDispatch());
    const { updateDescription } = GlobalDescriptionFunction({ updateDescription: updateStateRaceDescription })

    async function deleteRace(id: number): Promise<void> {
        return RaceControllerService.deleteRace(id)
            .then(() => removeRace(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editRace = async (id: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return RaceControllerService.updateRace(id, entryDTO)
            .then(() => {
                updateRace(id, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function addNewDesctiptionToRace(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return RaceControllerService.saveDescriptionToRace(id, descriptionDTO)
            .then((res) => addNewStateRaceDescription(id, res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function updateRaceDescription(raceId: number, descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescription(raceId, descriptionId, descriptionDTO);
    }

    async function deleteDescriptionFromRace(raceId: number, descriptionId: number) {
        return RaceControllerService.deleteDescriptionFromRace(raceId, descriptionId)
            .then((_) => removeStateRaceDescription(raceId, descriptionId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToRace(acceptedFiles: Blob, raceId: number) {
        return RaceControllerService.saveImageToRace(raceId!, { image: acceptedFiles })
            .then((res) => addImageToRace(res, raceId!))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function deleteImageFromRace(raceId: number, imageId: number): Promise<void> {
        return RaceControllerService.deleteImageFromRace(raceId, imageId)
            .then(() => removeImageFromRace(imageId, raceId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return {
        deleteRace, editRace,
        addNewDesctiptionToRace, updateRaceDescription, deleteDescriptionFromRace,
        saveImageToRace, deleteImageFromRace
    };
}