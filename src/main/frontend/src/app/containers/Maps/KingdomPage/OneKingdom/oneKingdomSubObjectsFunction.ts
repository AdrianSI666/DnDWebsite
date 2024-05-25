
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, KingdomRegionControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addNewRegionToKingdom, removeRegionFromKingdom } from "./store/oneKingdomSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    addNewRegionToKingdom: (regionDTO: EntryDTO) => {
        dispatch(addNewRegionToKingdom(regionDTO))
    },
    removeRegionFromKingdom: (regionId: number) => {
        dispatch(removeRegionFromKingdom(regionId))
    }
})

export function OneKingdomSubObjectsFunction() {
    const { addNewRegionToKingdom, removeRegionFromKingdom } = actionDispatch(useAppDispatch());
    const saveNewRegionToKingdom = async (kingdomId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return KingdomRegionControllerService.addNewRegionKingdomRelation(kingdomId, entryDTO)
            .then((res) => {
                addNewRegionToKingdom(res);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingRegionToKingdom = async (kingdomId: number, regionId: number, regionName: string, regionDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: regionName,
            description: regionDescription,
            id: regionId
        }
        return KingdomRegionControllerService.addKingdomRegionRelation(kingdomId, regionId)
            .then(() => {
                addNewRegionToKingdom(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllRegionsWithoutKingdom = async () => {
        return await KingdomRegionControllerService.getAllRegionsWithoutKingdom()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removeRegionFromKingdomFunction = async (kingdomId: number, regionId: number): Promise<void> => {
        return KingdomRegionControllerService.removeKingdomRegionRelation(kingdomId, regionId)
            .then(() => {
                removeRegionFromKingdom(regionId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewRegionToKingdom, saveExistingRegionToKingdom, removeRegionFromKingdomFunction, getAllRegionsWithoutKingdom };
}