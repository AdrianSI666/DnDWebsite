
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, EntryDTO, RegionBeastControllerService } from "../../../services/openapi";
import { useAppDispatch } from "../../hooks";
import { addNewRegionToBeast, removeRegionFromBeast } from "./store/beastPageSlice";

const actionDispatch = (dispatch: Dispatch) => ({
  addNewRegionToBeast: (beastId: number, regionDTO: EntryDTO) => {
    dispatch(addNewRegionToBeast({
        beastId,
      regionDTO
    }))
  },
  removeRegionFromBeast: (beastId: number, regionId: number) => {
    dispatch(removeRegionFromBeast({
        beastId,
      regionId
    }))
  }
})

export function BeastSubObjectsFunction() {
  const { addNewRegionToBeast, removeRegionFromBeast } = actionDispatch(useAppDispatch());
  const saveNewRegionToBeast = async (beastId: number, name: string, shortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return RegionBeastControllerService.addNewRegionBeastRelation(beastId, entryDTO)
      .then((result) => {
        addNewRegionToBeast(beastId, result);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const saveExistingRegionToBeast = async (beastId: number, regionId: number, regionName: string, regionShortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: regionName,
      shortDescription: regionShortDescription,
      id: regionId
    }
    return RegionBeastControllerService.addRegionBeastRelation(regionId, beastId)
      .then(() => {
        addNewRegionToBeast(beastId, entryDTO);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err.body);
        throw err
      });
  }

  const removeRegionFromBeastFunction = async (beastId: number, regionId: number): Promise<void> => {
    return RegionBeastControllerService.deleteRegionBeastRelation(regionId, beastId)
      .then(() => {
        removeRegionFromBeast(beastId, regionId);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { saveNewRegionToBeast, saveExistingRegionToBeast, removeRegionFromBeastFunction };
}