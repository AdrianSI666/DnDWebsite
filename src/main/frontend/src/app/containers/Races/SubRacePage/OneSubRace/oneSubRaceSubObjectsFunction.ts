
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, RegionSubRaceControllerService, RaceSubRaceControllerService, RaceControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addNewRegionToSubRace, removeRegionFromSubRace, removeRaceFromSubRace, setRaceToSubRace } from "./store/oneSubRaceSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    setRaceToSubRace: (raceEntryDTO: EntryDTO) => {
        dispatch(setRaceToSubRace(raceEntryDTO))
    },
    removeRaceFromSubRace: () => {
        dispatch(removeRaceFromSubRace())
    },
    addNewRegionToSubRace: (regionDTO: EntryDTO) => {
        dispatch(addNewRegionToSubRace(regionDTO))
    },
    removeRegionFromSubRace: (regionId: number) => {
        dispatch(removeRegionFromSubRace(regionId))
    },

})

export function OneSubRaceSubObjectsFunction() {
    const { setRaceToSubRace, removeRaceFromSubRace, addNewRegionToSubRace, removeRegionFromSubRace } = actionDispatch(useAppDispatch());

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
    
    
    
      const saveNewRegionToSubRace = async (subRaceId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
          name: name,
          description: description
        }
        return RegionSubRaceControllerService.addNewRegionSubRaceRelation(subRaceId, entryDTO)
          .then((result) => {
            addNewRegionToSubRace(entryDTO);
          })
          .catch((err: ApiError) => {
            console.log("My Error: ", err);
            throw err
          });
      }
    
      const saveExistingRegionToSubRace = async (subRaceId: number, regionId: number, regionName: string, regionDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
          name: regionName,
          description: regionDescription,
          id: regionId
        }
        return RegionSubRaceControllerService.addSubRaceRegionRelation(regionId, subRaceId)
          .then(() => {
            addNewRegionToSubRace(entryDTO);
          })
          .catch((err: ApiError) => {
            console.log("My Error: ", err.body);
            throw err
          });
      }
    
      const removeRegionFromSubRaceFunction = async (subRaceId: number, regionId: number): Promise<void> => {
        return RegionSubRaceControllerService.deleteSubRaceRegionRelation(regionId, subRaceId)
          .then(() => {
            removeRegionFromSubRace(regionId);
          })
          .catch((err: ApiError) => {
            console.log("My Error: ", err);
            throw err
          });
      }

    return { setNewRaceToSubRace, setExistingRaceToSubRace, removeRaceFromSubRaceFunction, getAllRaces, saveNewRegionToSubRace, saveExistingRegionToSubRace, removeRegionFromSubRaceFunction };
}
