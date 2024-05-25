
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, RaceControllerService, EntryDTO, RegionRaceControllerService } from "../../../../../services/openapi";
import { useAppDispatch } from "../../../../hooks";
import { addNewRaceToRegion, removeRaceFromRegion } from "../store/regionPageSlice";

const actionDispatch = (dispatch: Dispatch) => ({
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
    }
})

export function RegionRacesFunction() {
    const { addNewRaceToRegion, removeRaceFromRegion } = actionDispatch(useAppDispatch());

    const getAllRaces = async () => {
        return await RaceControllerService.getAllRaces()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const saveNewRaceToRegion = async (regionId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return RegionRaceControllerService.addNewRaceRegionRelation(regionId, entryDTO)
            .then((result) => {
                addNewRaceToRegion(regionId, result);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingRaceToRegion = async (regionId: number, raceId: number, raceName: string, raceDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: raceName,
            description: raceDescription,
            id: raceId
        }
        return RegionRaceControllerService.addRegionRaceRelation(regionId, raceId)
            .then(() => {
                addNewRaceToRegion(regionId, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const removeRaceFromRegionFunction = async (regionId: number, raceId: number): Promise<void> => {
        return RegionRaceControllerService.deleteRegionRaceRelation(regionId, raceId)
            .then(() => {
                removeRaceFromRegion(regionId, raceId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewRaceToRegion, saveExistingRaceToRegion, removeRaceFromRegionFunction, getAllRaces };
}