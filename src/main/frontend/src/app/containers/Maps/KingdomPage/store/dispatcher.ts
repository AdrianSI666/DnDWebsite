import { Dispatch } from "@reduxjs/toolkit"
import { EntryDTO, ImageDTO } from "../../../../../services/openapi"
import { addImageToKingdom, addNewRegionToKingdom, removeContinentFromKingdom, removeImageFromKingdom, removeKingdom, removeRegionFromKingdom, setContinentToKingdom, updateKingdom } from "./kingdomPageSlice"
import { useAppDispatch } from "../../../../hooks"

const actionDispatch = (dispatch: Dispatch) => ({
    setContinentToKingdom: (kingdomId: number, continentDTO: EntryDTO) => {
        dispatch(setContinentToKingdom({
            kingdomId,
            continentDTO
        }))
    },
    removeContinentFromKingdom: (kingdomId: number, continentId: number) => {
        dispatch(removeContinentFromKingdom({
            kingdomId,
            subObjectId: continentId
        }))
    },
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
    addNewRegionToKingdom: (kingdomId: number, regionDTO: EntryDTO) => {
        dispatch(addNewRegionToKingdom({
            kingdomId,
            regionDTO
        }))
    },
    removeRegionFromKingdom: (kingdomId: number, regionId: number) => {
        dispatch(removeRegionFromKingdom({
            kingdomId,
            subObjectId: regionId
        }))
    }
})

export function KingdomsDispatcher() {
    const { setContinentToKingdom, removeContinentFromKingdom,
        addImageToKingdom, removeImageFromKingdom, removeKingdom, updateKingdom,
        addNewRegionToKingdom, removeRegionFromKingdom
    } = actionDispatch(useAppDispatch());

    return {
        setContinentToKingdom, removeContinentFromKingdom,
        addImageToKingdom, removeImageFromKingdom, removeKingdom, updateKingdom,
        addNewRegionToKingdom, removeRegionFromKingdom
    };
}
