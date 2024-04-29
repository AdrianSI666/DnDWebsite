
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, EntryDTO, RegionCultureControllerService } from "../../../services/openapi";
import { useAppDispatch } from "../../hooks";
import { addNewRegionToCulture, removeRegionFromCulture } from "./store/culturePageSlice";

const actionDispatch = (dispatch: Dispatch) => ({
  addNewRegionToCulture: (cultureId: number, regionDTO: EntryDTO) => {
    dispatch(addNewRegionToCulture({
      cultureId,
      regionDTO
    }))
  },
  removeRegionFromCulture: (cultureId: number, regionId: number) => {
    dispatch(removeRegionFromCulture({
      cultureId,
      regionId
    }))
  }
})

export function CultureSubObjectsFunction() {
  const { addNewRegionToCulture, removeRegionFromCulture } = actionDispatch(useAppDispatch());
  const saveNewRegionToCulture = async (cultureId: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      description: description
    }
    return RegionCultureControllerService.addNewRegionCultureRegion(cultureId, entryDTO)
      .then((result) => {
        addNewRegionToCulture(cultureId, result);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const saveExistingRegionToCulture = async (cultureId: number, regionId: number, regionName: string, regionDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: regionName,
      description: regionDescription,
      id: regionId
    }
    return RegionCultureControllerService.addCultureRegionRelation(regionId, cultureId)
      .then(() => {
        addNewRegionToCulture(cultureId, entryDTO);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err.body);
        throw err
      });
  }

  const removeRegionFromCultureFunction = async (cultureId: number, regionId: number): Promise<void> => {
    return RegionCultureControllerService.deleteCulture(regionId, cultureId)
      .then(() => {
        removeRegionFromCulture(cultureId, regionId);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { saveNewRegionToCulture, saveExistingRegionToCulture, removeRegionFromCultureFunction };
}