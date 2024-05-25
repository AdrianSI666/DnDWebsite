
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, SubRaceControllerService, EntryDTO, RegionSubRaceControllerService } from "../../../../../services/openapi";
import { useAppDispatch } from "../../../../hooks";
import { addNewSubRaceToRegion, removeSubRaceFromRegion } from "../store/regionPageSlice";

const actionDispatch = (dispatch: Dispatch) => ({
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

export function RegionSubRacesFunction() {
    const { addNewSubRaceToRegion, removeSubRaceFromRegion } = actionDispatch(useAppDispatch());

    const getAllSubRaces = async () => {
        return await SubRaceControllerService.getAllSubRaces()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const saveNewSubRaceToRegion = async (regionId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return RegionSubRaceControllerService.addNewSubRaceRegionRelation(regionId, entryDTO)
            .then((result) => {
                addNewSubRaceToRegion(regionId, result);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingSubRaceToRegion = async (regionId: number, subSubRaceId: number, subSubRaceName: string, subSubRaceDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: subSubRaceName,
            description: subSubRaceDescription,
            id: subSubRaceId
        }
        return RegionSubRaceControllerService.addRegionSubRaceRelation(regionId, subSubRaceId)
            .then(() => {
                addNewSubRaceToRegion(regionId, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const removeSubRaceFromRegionFunction = async (regionId: number, subSubRaceId: number): Promise<void> => {
        return RegionSubRaceControllerService.deleteRegionSubRaceRelation(regionId, subSubRaceId)
            .then(() => {
                removeSubRaceFromRegion(regionId, subSubRaceId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewSubRaceToRegion, saveExistingSubRaceToRegion, removeSubRaceFromRegionFunction, getAllSubRaces };
}