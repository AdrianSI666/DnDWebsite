
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, KingdomControllerService, EntryDTO, ImageDTO } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { addImageToKingdom, removeKingdom, removeImageFromKingdom, updateKingdom } from "./store/kingdomPageSlice";

interface IKingdomFunction {
    kingdomId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    removeKingdom: (id: number) => {
        dispatch(removeKingdom(id))
    },
    updateKingdom: (id: number, entryDTO: EntryDTO) => {
        dispatch(updateKingdom({ id, entryDTO }))
    },
    addImageToKingdom: (imageDTO: ImageDTO, kingdomId: number) => {
        let payload = {
            kingdomId,
            imageDTO
        }
        dispatch(addImageToKingdom(payload))
    },
    removeImageFromKingdom: (imageId: number, kingdomId: number) => {
        dispatch(removeImageFromKingdom({
            kingdomId,
            imageId
        }))
    },
})

export function KingdomFunction(props: IKingdomFunction) {
    const { removeKingdom, addImageToKingdom, removeImageFromKingdom, updateKingdom } = actionDispatch(useAppDispatch());
    async function deleteKingdom(id: number): Promise<void> {
        return KingdomControllerService.deleteKingdom(id)
            .then(() => removeKingdom(id))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editKingdom = async (id: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return KingdomControllerService.updateKingdom(id, entryDTO)
            .then(() => {
                updateKingdom(id, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function saveImageToKingdom(acceptedFiles: Blob) {
        return KingdomControllerService.saveImageToKingdom(props.kingdomId!, { image: acceptedFiles })
            .then((res) => addImageToKingdom(res, props.kingdomId!))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    async function deleteImageFromKingdom(kingdomId: number, imageId: number): Promise<void> {
        return KingdomControllerService.deleteImageFromKingdom(kingdomId, imageId)
            .then(() => removeImageFromKingdom(imageId, kingdomId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { deleteKingdom, editKingdom, saveImageToKingdom, deleteImageFromKingdom };
}