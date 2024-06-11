import { Dispatch } from "@reduxjs/toolkit"
import { DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../../services/openapi"
import { useAppDispatch } from "../../../../../hooks"
import { setContinentToKingdom, removeContinentFromKingdom, addNewRegionToKingdom, removeRegionFromKingdom, setKingdom, updateKingdom, addImageToKingdom, removeImageFromKingdom, addKingdomDescription, updateKingdomDescription, removeKingdomDescription } from "./oneKingdomSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    setContinentToKingdom: (continentEntryDTO: EntryDTO) => {
        dispatch(setContinentToKingdom(continentEntryDTO))
    },
    removeContinentFromKingdom: () => {
        dispatch(removeContinentFromKingdom())
    },

    addNewRegionToKingdom: (regionDTO: EntryDTO) => {
        dispatch(addNewRegionToKingdom(regionDTO))
    },
    removeRegionFromKingdom: (regionId: number) => {
        dispatch(removeRegionFromKingdom(regionId))
    },

    setKingdom: (kingdom: EntryFullDTO) => {
        dispatch(setKingdom(kingdom))
    },
    updateKingdom: (kingdom: EntryDTO) => {
        dispatch(updateKingdom(kingdom))
    },

    addNewStateKingdomDescription: (descriptionDTO: DescriptionDTO) => {
        dispatch(addKingdomDescription(descriptionDTO))
    },
    updateStateKingdomDescription: (descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updateKingdomDescription({ descriptionId, descriptionDTO }))
    },
    removeStateKingdomDescription: (descriptionId: number) => {
        dispatch(removeKingdomDescription(descriptionId))
    },

    addImageToKingdom: (imageDTO: ImageDTO) => {
        dispatch(addImageToKingdom(imageDTO))
    },
    removeImageFromKingdom: (imageId: number) => {
        dispatch(removeImageFromKingdom(imageId))
    }
})
export function OneKingdomDispatcher() {
    const { setContinentToKingdom, removeContinentFromKingdom,
        addNewRegionToKingdom, removeRegionFromKingdom,
        setKingdom, addImageToKingdom, removeImageFromKingdom, updateKingdom,
        addNewStateKingdomDescription, updateStateKingdomDescription, removeStateKingdomDescription
    } = actionDispatch(useAppDispatch());

    return {
        setContinentToKingdom, removeContinentFromKingdom,
        addNewRegionToKingdom, removeRegionFromKingdom,
        setKingdom, addImageToKingdom, removeImageFromKingdom, updateKingdom,
        addNewStateKingdomDescription, updateStateKingdomDescription, removeStateKingdomDescription
    }
}