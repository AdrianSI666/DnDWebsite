
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, RegionSubRaceControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addNewRegionToSubRace, removeRegionFromSubRace } from "./store/oneSubRaceSlice"

const actionDispatch = (dispatch: Dispatch) => ({
  addNewRegionToSubRace: (regionDTO: EntryDTO) => {
    dispatch(addNewRegionToSubRace(regionDTO))
  },
  removeRegionFromSubRace: (regionId: number) => {
    dispatch(removeRegionFromSubRace(regionId))
  },

})

export function OneSubRaceSubObjectsFunction() {
  const { addNewRegionToSubRace, removeRegionFromSubRace } = actionDispatch(useAppDispatch());

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

  return { saveNewRegionToSubRace, saveExistingRegionToSubRace, removeRegionFromSubRaceFunction };
}
