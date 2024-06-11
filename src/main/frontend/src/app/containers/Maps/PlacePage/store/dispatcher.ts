import { Dispatch } from "@reduxjs/toolkit"
import { DescriptionDTO, EntryDTO, ImageDTO } from "../../../../../services/openapi"
import { removePlace, updatePlace, addImageToPlace, removeImageFromPlace, removeRegionFromPlace, setRegionToPlace, addPlaceDescription, updatePlaceDescription, removePlaceDescription } from "./placePageSlice"
import { useAppDispatch } from "../../../../hooks"


const actionDispatch = (dispatch: Dispatch) => ({
    removePlace: (id: number) => {
        dispatch(removePlace(id))
    },
    updatePlace: (id: number, entryDTO: EntryDTO) => {
        dispatch(updatePlace({ id, entryDTO }))
    },

    addNewStatePlaceDescription: (id: number, descriptionDTO: DescriptionDTO) => {
        dispatch(addPlaceDescription({ placeId: id, descriptionDTO }))
    },
    updateStatePlaceDescription: (placeId: number, descriptionId: number, descriptionDTO: DescriptionDTO) => {
        dispatch(updatePlaceDescription({ placeId, descriptionId, descriptionDTO }))
    },
    removeStatePlaceDescription: (placeId: number, descriptionId: number) => {
        dispatch(removePlaceDescription({ placeId, subObjectId: descriptionId }))
    },

    addImageToPlace: (imageDTO: ImageDTO, placeId: number) => {
        let payload = {
            placeId,
            imageDTO
        }
        dispatch(addImageToPlace(payload))
    },
    removeImageFromPlace: (imageId: number, placeId: number) => {
        dispatch(removeImageFromPlace({
            placeId,
            subObjectId: imageId
        }))
    },

    setRegionToPlace: (placeId: number, regionDTO: EntryDTO) => {
        dispatch(setRegionToPlace({
            placeId,
            regionDTO
        }))
    },
    removeRegionFromPlace: (placeId: number, regionId: number) => {
        dispatch(removeRegionFromPlace({
            placeId,
            subObjectId: regionId
        }))
    }
})

export function PlaceDispatcher() {
    const { removeRegionFromPlace, setRegionToPlace,
        addNewStatePlaceDescription, updateStatePlaceDescription, removeStatePlaceDescription,
        removeImageFromPlace, addImageToPlace,
        updatePlace, removePlace } = actionDispatch(useAppDispatch());
    return {
        removeRegionFromPlace, setRegionToPlace,
        addNewStatePlaceDescription, updateStatePlaceDescription, removeStatePlaceDescription,
        removeImageFromPlace, addImageToPlace,
        updatePlace, removePlace
    };
}