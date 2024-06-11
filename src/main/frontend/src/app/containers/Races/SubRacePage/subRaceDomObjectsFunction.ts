
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, RaceControllerService, RaceSubRaceControllerService } from "../../../../services/openapi"
import { useAppDispatch } from "../../../hooks"
import { removeRaceFromSubRace, setRaceToSubRace } from "./store/subRacePageSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    setRaceToSubRace: (subRaceId: number, raceEntryDTO: EntryDTO) => {
        dispatch(setRaceToSubRace({
            subRaceId,
            entryDTO: raceEntryDTO
        }))
    },
    removeRaceFromSubRace: (subRaceId: number, raceId: number) => {
        dispatch(removeRaceFromSubRace({
            subRaceId,
            subObjectId: raceId
        }))
    }
})

export function SubRaceDomObjectsFunction() {
    const { setRaceToSubRace, removeRaceFromSubRace } = actionDispatch(useAppDispatch());

    const setNewRaceToSubRace = async (subRaceId: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return RaceSubRaceControllerService.addNewRaceRelation(subRaceId, entryDTO)
            .then((result) => {
                setRaceToSubRace(subRaceId, result);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const setExistingRaceToSubRace = async (subRaceId: number, raceId: number, raceName: string, raceDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: raceName,
            shortDescription: raceDescription,
            id: raceId
        }
        return RaceSubRaceControllerService.addSubRaceRelationRace(raceId, subRaceId)
            .then(() => {
                setRaceToSubRace(subRaceId, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllRaces = async () => {
        return await RaceControllerService.getAllRaces()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removeRaceFromSubRaceFunction = async (subRaceId: number, raceId: number): Promise<void> => {
        return RaceSubRaceControllerService.removeSubRaceRelationRace(raceId, subRaceId)
            .then(() => {
                removeRaceFromSubRace(subRaceId, raceId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { setNewRaceToSubRace, setExistingRaceToSubRace, removeRaceFromSubRaceFunction, getAllRaces };
}
