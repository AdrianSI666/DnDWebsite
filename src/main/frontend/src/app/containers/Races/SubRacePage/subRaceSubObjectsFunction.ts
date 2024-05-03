
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, RegionSubRaceControllerService } from "../../../../services/openapi"
import { useAppDispatch } from "../../../hooks"
import { addNewRegionToSubRace, removeRegionFromSubRace } from "./store/subRacePageSlice"

const actionDispatch = (dispatch: Dispatch) => ({
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
  const { addNewRegionToSubRace, removeRegionFromSubRace } = actionDispatch(useAppDispatch());

  const saveNewRegionToSubRace = async (subRaceId: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      description: description
    }
    return RegionSubRaceControllerService.addNewRegionSubRaceRelation(subRaceId, entryDTO)
      .then((result) => {
        addNewRegionToSubRace(subRaceId, result);
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

  return { saveNewRegionToSubRace, saveExistingRegionToSubRace, removeRegionFromSubRaceFunction };
}
