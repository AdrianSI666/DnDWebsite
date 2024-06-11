
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, RaceSubRaceControllerService, RegionRaceControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addNewRegionToRace, addNewSubRaceToRace, removeRegionFromRace, removeSubRaceFromRace } from "./store/oneRaceSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    addNewSubRaceToRace: (subRaceDTO: EntryDTO) => {
        dispatch(addNewSubRaceToRace(subRaceDTO))
    },
    removeSubRaceFromRace: (subRaceId: number) => {
        dispatch(removeSubRaceFromRace(subRaceId))
    },
    addNewRegionToRace: (regionDTO: EntryDTO) => {
        dispatch(addNewRegionToRace(regionDTO))
    },
    removeRegionFromRace: (regionId: number) => {
        dispatch(removeRegionFromRace(regionId))
    },
})

export function OneRaceSubObjectsFunction() {
    const { addNewSubRaceToRace, removeSubRaceFromRace, addNewRegionToRace, removeRegionFromRace } = actionDispatch(useAppDispatch());
    const saveNewSubRaceToRace = async (raceId: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return RaceSubRaceControllerService.addNewSubRaceRelation(raceId, entryDTO)
            .then((res) => {
                addNewSubRaceToRace(res);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingSubRaceToRace = async (raceId: number, subRaceId: number, subRaceName: string, subRaceDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: subRaceName,
            shortDescription: subRaceDescription,
            id: subRaceId
        }
        return RaceSubRaceControllerService.addSubRaceRelationRace(raceId, subRaceId)
            .then(() => {
                addNewSubRaceToRace(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllSubRacesWithoutRace = async () => {
        return await RaceSubRaceControllerService.getAllSubRacesWithoutRace()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removeSubRaceFromRaceFunction = async (raceId: number, subRaceId: number): Promise<void> => {
        return RaceSubRaceControllerService.removeSubRaceRelationRace(raceId, subRaceId)
            .then(() => {
                removeSubRaceFromRace(subRaceId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveNewRegionToRace = async (raceId: number, name: string, shortDescription: string): Promise<void> => {
        let regionDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return RegionRaceControllerService.addNewRegionRaceRelation(raceId, regionDTO)
            .then((result) => {
                addNewRegionToRace(result);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingRegionToRace = async (raceId: number, regionId: number, subRaceName: string, subRaceDescription: string): Promise<void> => {
        let regionDTO: EntryDTO = {
            name: subRaceName,
            shortDescription: subRaceDescription,
            id: regionId
        }
        return RegionRaceControllerService.addRegionRaceRelation(regionId, raceId)
            .then(() => {
                addNewRegionToRace(regionDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const removeRegionFromRaceFunction = async (raceId: number, regionId: number): Promise<void> => {
        return RegionRaceControllerService.deleteRegionRaceRelation(regionId, raceId)
            .then(() => {
                removeRegionFromRace(regionId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewSubRaceToRace, saveExistingSubRaceToRace, removeSubRaceFromRaceFunction, getAllSubRacesWithoutRace, saveNewRegionToRace, saveExistingRegionToRace, removeRegionFromRaceFunction };
}