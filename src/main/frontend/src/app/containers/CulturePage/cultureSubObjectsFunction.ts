
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
  const saveNewRegionToCulture = async (cultureId: number, name: string, shortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
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

  const saveExistingRegionToCulture = async (cultureId: number, regionId: number, regionName: string, regionShortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: regionName,
      shortDescription: regionShortDescription,
      id: regionId
    }
    return RegionCultureControllerService.addRegionCultureRelation(regionId, cultureId)
      .then(() => {
        addNewRegionToCulture(cultureId, entryDTO);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err.body);
        throw err
      });
  }

  const removeRegionFromCultureFunction = async (cultureId: number, regionId: number): Promise<void> => {
    return RegionCultureControllerService.deleteRegionCultureRelation(regionId, cultureId)
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