
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, RegionSubRaceControllerService, RaceSubRaceControllerService, RaceControllerService } from "../../../../services/openapi"
import { useAppDispatch } from "../../../hooks"
import { addNewRegionToSubRace, removeRegionFromSubRace, removeRaceFromSubRace, setRaceToSubRace } from "./store/subRacePageSlice"

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
    },
    addNewRegionToSubRace: (subRaceId: number, regionDTO: EntryDTO) => {
        dispatch(addNewRegionToSubRace({
            subRaceId,
            entryDTO: regionDTO
        }))
    },
    removeRegionFromSubRace: (subRaceId: number, regionId: number) => {
        dispatch(removeRegionFromSubRace({
            subRaceId,
            subObjectId: regionId
        }))
    },

})

export function SubRaceSubObjectsFunction() {
    const { setRaceToSubRace, removeRaceFromSubRace, addNewRegionToSubRace, removeRegionFromSubRace } = actionDispatch(useAppDispatch());

    const setNewRaceToSubRace = async (subRaceId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
          name: name,
          description: description
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
          description: raceDescription,
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
    
    
    
      const saveNewRegionToSubRace = async (SubRaceId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
          name: name,
          description: description
        }
        return RegionSubRaceControllerService.addNewRegionSubRaceRelation(SubRaceId, entryDTO)
          .then((result) => {
            addNewRegionToSubRace(SubRaceId, entryDTO);
          })
          .catch((err: ApiError) => {
            console.log("My Error: ", err);
            throw err
          });
      }
    
      const saveExistingRegionToSubRace = async (subRaceId: number, regionId: number, subSubRaceName: string, subSubRaceDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
          name: subSubRaceName,
          description: subSubRaceDescription,
          id: regionId
        }
        return RegionSubRaceControllerService.addSubRaceRegionRelation(regionId, subRaceId)
          .then(() => {
            addNewRegionToSubRace(subRaceId, entryDTO);
          })
          .catch((err: ApiError) => {
            console.log("My Error: ", err.body);
            throw err
          });
      }
    
      const removeRegionFromSubRaceFunction = async (subRaceId: number, regionId: number): Promise<void> => {
        return RegionSubRaceControllerService.deleteSubRaceRegionRelation(regionId, subRaceId)
          .then(() => {
            removeRegionFromSubRace(subRaceId, regionId);
          })
          .catch((err: ApiError) => {
            console.log("My Error: ", err);
            throw err
          });
      }

    return { setNewRaceToSubRace, setExistingRaceToSubRace, removeRaceFromSubRaceFunction, getAllRaces, saveNewRegionToSubRace, saveExistingRegionToSubRace, removeRegionFromSubRaceFunction };
}
