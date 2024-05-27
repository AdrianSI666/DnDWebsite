
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, RaceControllerService, RaceSubRaceControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { removeRaceFromSubRace, setRaceToSubRace } from "./store/oneSubRaceSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    setRaceToSubRace: (raceEntryDTO: EntryDTO) => {
        dispatch(setRaceToSubRace(raceEntryDTO))
    },
    removeRaceFromSubRace: () => {
        dispatch(removeRaceFromSubRace())
    }
})

export function OneSubRaceDomObjectsFunction() {
    const { setRaceToSubRace, removeRaceFromSubRace } = actionDispatch(useAppDispatch());

    const setNewRaceToSubRace = async (subRaceId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return RaceSubRaceControllerService.addNewRaceRelation(subRaceId, entryDTO)
            .then((result) => {
                setRaceToSubRace(result);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const setExistingRaceToSubRace = async (subRaceId: number, raceId: number, raceName: string, raceDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: raceName,
            description: raceDescription,
            id: raceId
        }
        return RaceSubRaceControllerService.addSubRaceRelationRace(raceId, subRaceId)
            .then(() => {
                setRaceToSubRace(entryDTO);
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
                removeRaceFromSubRace();
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { setNewRaceToSubRace, setExistingRaceToSubRace, removeRaceFromSubRaceFunction, getAllRaces };
}
