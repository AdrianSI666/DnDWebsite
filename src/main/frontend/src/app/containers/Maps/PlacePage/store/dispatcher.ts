import { Dispatch } from "@reduxjs/toolkit"
import { EntryDTO, ImageDTO } from "../../../../../services/openapi"
import { removePlace, updatePlace, addImageToPlace, removeImageFromPlace, removeRegionFromPlace, setRegionToPlace } from "./placePageSlice"
import { useAppDispatch } from "../../../../hooks"


const actionDispatch = (dispatch: Dispatch) => ({
    removePlace: (id: number) => {
        dispatch(removePlace(id))
    },
    updatePlace: (id: number, entryDTO: EntryDTO) => {
        dispatch(updatePlace({ id, entryDTO }))
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
            imageId
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
    const { removeRegionFromPlace, setRegionToPlace, removeImageFromPlace, addImageToPlace, updatePlace, removePlace } = actionDispatch(useAppDispatch());
    return {
        removeRegionFromPlace, setRegionToPlace, removeImageFromPlace, addImageToPlace, updatePlace, removePlace
    };
}