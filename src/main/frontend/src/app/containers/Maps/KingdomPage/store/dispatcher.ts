import { Dispatch } from "@reduxjs/toolkit"
import { DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../services/openapi"
import { addImageToKingdom, addKingdomDescription, addNewRegionToKingdom, fillKingdomData, removeContinentFromKingdom, removeImageFromKingdom, removeKingdom, removeKingdomDescription, removeRegionFromKingdom, setContinentToKingdom, updateKingdom, updateKingdomDescription } from "./kingdomPageSlice"
import { useAppDispatch } from "../../../../hooks"

const actionDispatch = (dispatch: Dispatch) => ({
    fillKingdomData: (data: EntryFullDTO) => {
        dispatch(fillKingdomData(data))
    },
    
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

    addNewStateKingdomDescription: (id: number, descriptionDTO: DescriptionDTO) => {
        dispatch(addKingdomDescription({ kingdomId: id, descriptionDTO }))
    },
    updateStateKingdomDescription: (kingdomId: number, descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updateKingdomDescription({ kingdomId, descriptionId, descriptionDTO }))
    },
    removeStateKingdomDescription: (kingdomId: number, descriptionId: number) => {
        dispatch(removeKingdomDescription({ kingdomId, subObjectId: descriptionId }))
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
        addImageToKingdom, removeImageFromKingdom,
        addNewStateKingdomDescription, updateStateKingdomDescription, removeStateKingdomDescription,
        removeKingdom, updateKingdom, fillKingdomData,
        addNewRegionToKingdom, removeRegionFromKingdom
    } = actionDispatch(useAppDispatch());

    return {
        setContinentToKingdom, removeContinentFromKingdom,
        addNewStateKingdomDescription, updateStateKingdomDescription, removeStateKingdomDescription,
        addImageToKingdom, removeImageFromKingdom,
        removeKingdom, updateKingdom, fillKingdomData,
        addNewRegionToKingdom, removeRegionFromKingdom
    };
}
