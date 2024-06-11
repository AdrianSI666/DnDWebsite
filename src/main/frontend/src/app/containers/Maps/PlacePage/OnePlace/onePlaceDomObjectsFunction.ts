import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, RegionControllerService, RegionPlaceControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { removeRegionFromPlace, setRegionToPlace } from "./store/onePlaceSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    setRegionToPlace: (regionEntryDTO: EntryDTO) => {
        dispatch(setRegionToPlace(regionEntryDTO))
    },
    removeRegionFromPlace: () => {
        dispatch(removeRegionFromPlace())
    }
})

export function OnePlaceDomObjectsFunction() {
    const { setRegionToPlace, removeRegionFromPlace } = actionDispatch(useAppDispatch());

    const setNewRegionToPlace = async (placeId: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return RegionPlaceControllerService.addNewRegionPlaceRelation(placeId, entryDTO)
            .then((result) => {
                setRegionToPlace(result);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const setExistingRegionToPlace = async (placeId: number, regionId: number, regionName: string, regionDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: regionName,
            shortDescription: regionDescription,
            id: regionId
        }
        return RegionPlaceControllerService.addRegionPlaceRelation(regionId, placeId)
            .then(() => {
                setRegionToPlace(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllRegions = async () => {
        return await RegionControllerService.getAllRegions()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removeRegionFromPlaceFunction = async (placeId: number, regionId: number): Promise<void> => {
        return RegionPlaceControllerService.removeRegionPlaceRelation(regionId, placeId)
            .then(() => {
                removeRegionFromPlace();
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { setNewRegionToPlace, setExistingRegionToPlace, removeRegionFromPlaceFunction, getAllRegions };
}
