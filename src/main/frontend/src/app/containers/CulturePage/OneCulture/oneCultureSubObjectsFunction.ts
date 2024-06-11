
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, RegionCultureControllerService } from "../../../../services/openapi"
import { useAppDispatch } from "../../../hooks"
import { addNewRegionToCulture, removeRegionFromCulture } from "./store/oneCultureSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    addNewRegionToCulture: (regionDTO: EntryDTO) => {
        dispatch(addNewRegionToCulture(regionDTO))
    },
    removeRegionFromCulture: (regionId: number) => {
        dispatch(removeRegionFromCulture(regionId))
    }
})

export function OneCultureSubObjectsFunction() {
    const { addNewRegionToCulture, removeRegionFromCulture } = actionDispatch(useAppDispatch());
    const saveNewRegionToCulture = async (cultureId: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return RegionCultureControllerService.addNewRegionCultureRegion(cultureId, entryDTO)
            .then((result) => {
                addNewRegionToCulture(result);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingRegionToCulture = async (cultureId: number, regionId: number, regionName: string, regionDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: regionName,
            shortDescription: regionDescription,
            id: regionId
        }
        return RegionCultureControllerService.addRegionCultureRelation(regionId, cultureId)
            .then(() => {
                addNewRegionToCulture(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const removeRegionFromCultureFunction = async (cultureId: number, regionId: number): Promise<void> => {
        return RegionCultureControllerService.deleteRegionCultureRelation(regionId, cultureId)
            .then(() => {
                removeRegionFromCulture(regionId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewRegionToCulture, saveExistingRegionToCulture, removeRegionFromCultureFunction };
}