
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, ImageDTO, SubRaceControllerService } from "../../../../services/openapi"
import { useAppDispatch } from "../../../hooks"
import { addImageToSubRace, removeImageFromSubRace, removeSubRace, updateSubRace } from "./store/subRacePageSlice"

interface ISubRaceFunction {
    subRaceId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    removeSubRace: (id: number) => {
        dispatch(removeSubRace(id))
    },
    updateSubRace: (id: number, entryDTO: EntryDTO) => {
        dispatch(updateSubRace({ id, entryDTO }))
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
            imageId
        }))
    },

})

export function SubRaceFunction(props: ISubRaceFunction) {
    const { removeSubRace, updateSubRace, addImageToSubRace, removeImageFromSubRace } = actionDispatch(useAppDispatch());

    async function deleteSubRace(id: number): Promise<void> {
        return SubRaceControllerService.deleteSubRace(id)
            .then(() => removeSubRace(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editSubRace = async (id: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
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

    async function saveImageToSubRace(acceptedFiles: Blob) {
        return SubRaceControllerService.saveImageToSubRace(props.subRaceId!, { image: acceptedFiles })
            .then((res) => addImageToSubRace(res, props.subRaceId!))
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

    return { deleteSubRace, editSubRace, saveImageToSubRace, deleteImageFromSubRace };
}