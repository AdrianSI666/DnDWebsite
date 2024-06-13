
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, RegionBeastControllerService } from "../../../../services/openapi"
import { useAppDispatch } from "../../../hooks"
import { addNewRegionToBeast, removeRegionFromBeast } from "./store/oneBeastSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    addNewRegionToBeast: (regionDTO: EntryDTO) => {
        dispatch(addNewRegionToBeast(regionDTO))
    },
    removeRegionFromBeast: (regionId: number) => {
        dispatch(removeRegionFromBeast(regionId))
    }
})

export function OneBeastSubObjectsFunction() {
    const { addNewRegionToBeast, removeRegionFromBeast } = actionDispatch(useAppDispatch());
    const saveNewRegionToBeast = async (beastId: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return RegionBeastControllerService.addNewRegionBeastRelation(beastId, entryDTO)
            .then((result) => {
                addNewRegionToBeast(result);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingRegionToBeast = async (beastId: number, regionId: number, regionName: string, regionDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: regionName,
            shortDescription: regionDescription,
            id: regionId
        }
        return RegionBeastControllerService.addRegionBeastRelation(regionId, beastId)
            .then(() => {
                addNewRegionToBeast(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const removeRegionFromBeastFunction = async (beastId: number, regionId: number): Promise<void> => {
        return RegionBeastControllerService.deleteRegionBeastRelation(regionId, beastId)
            .then(() => {
                removeRegionFromBeast(beastId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewRegionToBeast, saveExistingRegionToBeast, removeRegionFromBeastFunction };
}