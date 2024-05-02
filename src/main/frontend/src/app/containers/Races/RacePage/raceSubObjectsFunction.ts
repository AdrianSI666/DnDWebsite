
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, RaceSubRaceControllerService, RegionRaceControllerService } from "../../../../services/openapi"
import { useAppDispatch } from "../../../hooks"
import { addNewRegionToRace, addNewSubRaceToRace, removeRegionFromRace, removeSubRaceFromRace } from "./store/racePageSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    addNewSubRaceToRace: (raceId: number, subRaceDTO: EntryDTO) => {
        dispatch(addNewSubRaceToRace({
            raceId,
            subObjectEntryDTO: subRaceDTO
        }))
    },
    removeSubRaceFromRace: (raceId: number, subRaceId: number) => {
        dispatch(removeSubRaceFromRace({
            raceId,
            subObjectId: subRaceId
        }))
    },
    addNewRegionToRace: (raceId: number, regionDTO: EntryDTO) => {
        dispatch(addNewRegionToRace({
            raceId,
            subObjectEntryDTO: regionDTO
        }))
    },
    removeRegionFromRace: (raceId: number, regionId: number) => {
        dispatch(removeRegionFromRace({
            raceId,
            subObjectId: regionId
        }))
    },

})

export function RaceSubObjectsFunction() {
    const { addNewSubRaceToRace, removeSubRaceFromRace, addNewRegionToRace, removeRegionFromRace } = actionDispatch(useAppDispatch());

    const saveNewSubRaceToRace = async (raceId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
          name: name,
          description: description
        }
        return RaceSubRaceControllerService.addNewSubRaceRelation(raceId, entryDTO)
          .then((result) => {
            addNewSubRaceToRace(raceId, result);
          })
          .catch((err: ApiError) => {
            console.log("My Error: ", err);
            throw err
          });
      }
    
      const saveExistingSubRaceToRace = async (raceId: number, subRaceId: number, subRaceName: string, subRaceDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
          name: subRaceName,
          description: subRaceDescription,
          id: subRaceId
        }
        return RaceSubRaceControllerService.addSubRaceRelationRace(raceId, subRaceId)
          .then(() => {
            addNewSubRaceToRace(raceId, entryDTO);
          })
          .catch((err: ApiError) => {
            console.log("My Error: ", err.body);
            throw err
          });
      }
    
      const getAllSubRaces = async () => {
        return await RaceSubRaceControllerService.getAllSubRacesWithoutRace()
          .catch((err) => {
            console.log("My Error: ", err);
          });
      }
    
      const removeSubRaceFromRaceFunction = async (raceId: number, subRaceId: number): Promise<void> => {
        return RaceSubRaceControllerService.removeSubRaceRelationRace(raceId, subRaceId)
          .then(() => {
            removeSubRaceFromRace(raceId, subRaceId);
          })
          .catch((err: ApiError) => {
            console.log("My Error: ", err);
            throw err
          });
      }
    
    
    
      const saveNewRegionToRace = async (raceId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
          name: name,
          description: description
        }
        return RegionRaceControllerService.addNewRegionRaceRelation(raceId, entryDTO)
          .then((result) => {
            addNewRegionToRace(raceId, result);
          })
          .catch((err: ApiError) => {
            console.log("My Error: ", err);
            throw err
          });
      }
    
      const saveExistingRegionToRace = async (raceId: number, regionId: number, subRaceName: string, subRaceDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
          name: subRaceName,
          description: subRaceDescription,
          id: regionId
        }
        return RegionRaceControllerService.addRaceRegionRelation(regionId, raceId)
          .then(() => {
            addNewRegionToRace(raceId, entryDTO);
          })
          .catch((err: ApiError) => {
            console.log("My Error: ", err.body);
            throw err
          });
      }
    
      const removeRegionFromRaceFunction = async (raceId: number, subRaceId: number): Promise<void> => {
        return RegionRaceControllerService.deleteRaceRegionRelation(raceId, subRaceId)
          .then(() => {
            removeRegionFromRace(raceId, subRaceId);
          })
          .catch((err: ApiError) => {
            console.log("My Error: ", err);
            throw err
          });
      }

    return { saveNewSubRaceToRace, saveExistingSubRaceToRace, getAllSubRaces, removeSubRaceFromRaceFunction, saveNewRegionToRace, saveExistingRegionToRace, removeRegionFromRaceFunction };
}