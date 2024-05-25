
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, EntryDTO, RegionPlaceControllerService } from "../../../../../services/openapi";
import { useAppDispatch } from "../../../../hooks";
import { addNewPlaceToRegion, removePlaceFromRegion } from "../store/regionPageSlice";

const actionDispatch = (dispatch: Dispatch) => ({
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
    }
})

export function RegionPlacesFunction() {
    const { addNewPlaceToRegion, removePlaceFromRegion } = actionDispatch(useAppDispatch());

    const getAllPlacesWithoutRegion = async () => {
        return await RegionPlaceControllerService.getAllPlacesWithoutRegion()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const saveNewPlaceToRegion = async (regionId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return RegionPlaceControllerService.addNewPlaceRegionRelation(regionId, entryDTO)
            .then((result) => {
                addNewPlaceToRegion(regionId, result);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingPlaceToRegion = async (regionId: number, placeId: number, placeName: string, placeDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: placeName,
            description: placeDescription,
            id: placeId
        }
        return RegionPlaceControllerService.addRegionPlaceRelation(regionId, placeId)
            .then(() => {
                addNewPlaceToRegion(regionId, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const removePlaceFromRegionFunction = async (regionId: number, placeId: number): Promise<void> => {
        return RegionPlaceControllerService.removeRegionPlaceRelation(regionId, placeId)
            .then(() => {
                removePlaceFromRegion(regionId, placeId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewPlaceToRegion, saveExistingPlaceToRegion, removePlaceFromRegionFunction, getAllPlacesWithoutRegion };
}