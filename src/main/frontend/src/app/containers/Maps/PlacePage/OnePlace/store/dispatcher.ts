import { Dispatch } from "@reduxjs/toolkit"
import { EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../../services/openapi"
import { setRegionToPlace, removeRegionFromPlace, setPlace, updatePlace, addImageToPlace, removeImageFromPlace } from "./onePlaceSlice"
import { useAppDispatch } from "../../../../../hooks"

const actionDispatch = (dispatch: Dispatch) => ({
    setRegionToPlace: (regionEntryDTO: EntryDTO) => {
        dispatch(setRegionToPlace(regionEntryDTO))
    },
    removeRegionFromPlace: () => {
        dispatch(removeRegionFromPlace())
    },
    setPlace: (place: EntryFullDTO) => {
        dispatch(setPlace(place))
    },
    updatePlace: (place: EntryDTO) => {
        dispatch(updatePlace(place))
    },
    addImageToPlace: (imageDTO: ImageDTO) => {
        dispatch(addImageToPlace(imageDTO))
    },
    removeImageFromPlace: (imageId: number) => {
        dispatch(removeImageFromPlace(imageId))
    },
})

export function OnePlaceDispatcher() {
    const { removeRegionFromPlace, setRegionToPlace, removeImageFromPlace, addImageToPlace, updatePlace } = actionDispatch(useAppDispatch());
    return {
        removeRegionFromPlace, setRegionToPlace, removeImageFromPlace, addImageToPlace, updatePlace
    };
}