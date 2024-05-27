
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, ImageDTO, RaceControllerService } from "../../../../services/openapi"
import { useAppDispatch } from "../../../hooks"
import { addImageToRace, removeImageFromRace, removeRace, updateRace } from "./store/racePageSlice"

interface IRaceFunction {
    raceId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    removeRace: (id: number) => {
        dispatch(removeRace(id))
    },
    updateRace: (id: number, entryDTO: EntryDTO) => {
        dispatch(updateRace({ id, entryDTO }))
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
            imageId
        }))
    },

})

export function RaceFunction(props: IRaceFunction) {
    const { removeRace, updateRace, addImageToRace, removeImageFromRace } = actionDispatch(useAppDispatch());

    async function deleteRace(id: number): Promise<void> {
        return RaceControllerService.deleteRace(id)
            .then(() => removeRace(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editRace = async (id: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
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

    async function saveImageToRace(acceptedFiles: Blob) {
        return RaceControllerService.saveImageToRace(props.raceId!, { image: acceptedFiles })
            .then((res) => addImageToRace(res, props.raceId!))
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

    return { deleteRace, editRace, saveImageToRace, deleteImageFromRace };
}