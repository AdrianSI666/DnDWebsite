import { Dispatch } from "@reduxjs/toolkit"
import { EntryDTO, ImageDTO } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addImageToRegion, addNewCultureToRegion, addNewPlaceToRegion, addNewRaceToRegion, addNewSubRaceToRegion, removeCultureFromRegion, removeImageFromRegion, removeKingdomFromRegion, removePlaceFromRegion, removeRaceFromRegion, removeRegion, removeSubRaceFromRegion, setKingdomToRegion, updateRegion } from "./regionPageSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    removeRegion: (id: number) => {
        dispatch(removeRegion(id))
    },
    updateRegion: (id: number, entryDTO: EntryDTO) => {
        dispatch(updateRegion({ id, entryDTO }))
    },
    addImageToRegion: (imageDTO: ImageDTO, regionId: number) => {
        let payload = {
            regionId,
            imageDTO
        }
        dispatch(addImageToRegion(payload))
    },
    removeImageFromRegion: (imageId: number, regionId: number) => {
        dispatch(removeImageFromRegion({
            regionId,
            imageId
        }))
    },

    setKingdomToRegion: (regionId: number, kingdomDTO: EntryDTO) => {
        dispatch(setKingdomToRegion({
            regionId,
            kingdomDTO
        }))
    },
    removeKingdomFromRegion: (regionId: number, kingdomId: number) => {
        dispatch(removeKingdomFromRegion({
            regionId,
            subObjectId: kingdomId
        }))
    },

    addNewPlaceToRegion: (regionId: number, placeDTO: EntryDTO) => {
        dispatch(addNewPlaceToRegion({
            regionId,
            subObjectDTO: placeDTO
        }))
    },
    removePlaceFromRegion: (regionId: number, placeId: number) => {
        dispatch(removePlaceFromRegion({
            regionId,
            subObjectId: placeId
        }))
    },

    addNewCultureToRegion: (regionId: number, subObjectDTO: EntryDTO) => {
        dispatch(addNewCultureToRegion({
            regionId,
            subObjectDTO
        }))
    },
    removeCultureFromRegion: (regionId: number, cultureId: number) => {
        dispatch(removeCultureFromRegion({
            regionId,
            subObjectId: cultureId
        }))
    },

    addNewRaceToRegion: (regionId: number, subObjectDTO: EntryDTO) => {
        dispatch(addNewRaceToRegion({
            regionId,
            subObjectDTO
        }))
    },
    removeRaceFromRegion: (regionId: number, raceId: number) => {
        dispatch(removeRaceFromRegion({
            regionId,
            subObjectId: raceId
        }))
    },

    addNewSubRaceToRegion: (regionId: number, subObjectDTO: EntryDTO) => {
        dispatch(addNewSubRaceToRegion({
            regionId,
            subObjectDTO
        }))
    },
    removeSubRaceFromRegion: (regionId: number, subSubRaceId: number) => {
        dispatch(removeSubRaceFromRegion({
            regionId,
            subObjectId: subSubRaceId
        }))
    }
})

export function RegionsDispatcher() {
    const { removeRegion, updateRegion, addImageToRegion, removeImageFromRegion,
        setKingdomToRegion, removeKingdomFromRegion, addNewPlaceToRegion, removePlaceFromRegion,
        addNewCultureToRegion, removeCultureFromRegion,
        addNewRaceToRegion, removeRaceFromRegion, addNewSubRaceToRegion, removeSubRaceFromRegion } = actionDispatch(useAppDispatch());
    return {
        removeRegion, updateRegion, addImageToRegion, removeImageFromRegion,
        setKingdomToRegion, removeKingdomFromRegion, addNewPlaceToRegion, removePlaceFromRegion,
        addNewCultureToRegion, removeCultureFromRegion,
        addNewRaceToRegion, removeRaceFromRegion, addNewSubRaceToRegion, removeSubRaceFromRegion
    };
}
