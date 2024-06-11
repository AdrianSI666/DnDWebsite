import { Dispatch } from "@reduxjs/toolkit"
import { DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../../services/openapi"
import { setRegionToPlace, removeRegionFromPlace, setPlace, updatePlace, addImageToPlace, removeImageFromPlace, addPlaceDescription, updatePlaceDescription, removePlaceDescription } from "./onePlaceSlice"
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

    addNewStatePlaceDescription: (descriptionDTO: DescriptionDTO) => {
        dispatch(addPlaceDescription(descriptionDTO))
    },
    updateStatePlaceDescription: (descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updatePlaceDescription({ descriptionId, descriptionDTO }))
    },
    removeStatePlaceDescription: (descriptionId: number) => {
        dispatch(removePlaceDescription(descriptionId))
    },

    addImageToPlace: (imageDTO: ImageDTO) => {
        dispatch(addImageToPlace(imageDTO))
    },
    removeImageFromPlace: (imageId: number) => {
        dispatch(removeImageFromPlace(imageId))
    },
})

export function OnePlaceDispatcher() {
    const { removeRegionFromPlace, setRegionToPlace,
        removeImageFromPlace, addImageToPlace,
        updatePlace, setPlace,
        addNewStatePlaceDescription, updateStatePlaceDescription, removeStatePlaceDescription } = actionDispatch(useAppDispatch());
    return {
        removeRegionFromPlace, setRegionToPlace,
        removeImageFromPlace, addImageToPlace,
        updatePlace, setPlace,
        addNewStatePlaceDescription, updateStatePlaceDescription, removeStatePlaceDescription
    };
}