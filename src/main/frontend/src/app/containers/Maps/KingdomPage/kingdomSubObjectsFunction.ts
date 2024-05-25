
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, EntryDTO, KingdomRegionControllerService } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { addNewRegionToKingdom, removeRegionFromKingdom } from "./store/kingdomPageSlice";

const actionDispatch = (dispatch: Dispatch) => ({
  addNewRegionToKingdom: (kingdomId: number, regionDTO: EntryDTO) => {
    dispatch(addNewRegionToKingdom({
        kingdomId,
      regionDTO
    }))
  },
  removeRegionFromKingdom: (kingdomId: number, regionId: number) => {
    dispatch(removeRegionFromKingdom({
        kingdomId,
        subObjectId: regionId
    }))
  }
})

export function KingdomSubObjectsFunction() {
  const { addNewRegionToKingdom, removeRegionFromKingdom } = actionDispatch(useAppDispatch());

  const getAllRegionsWithoutKingdom = async () => {
    return await KingdomRegionControllerService.getAllRegionsWithoutKingdom()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const saveNewRegionToKingdom = async (kingdomId: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      description: description
    }
    return KingdomRegionControllerService.addNewRegionKingdomRelation(kingdomId, entryDTO)
      .then((result) => {
        addNewRegionToKingdom(kingdomId, result);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const saveExistingRegionToKingdom = async (kingdomId: number, regionId: number, regionName: string, regionDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: regionName,
      description: regionDescription,
      id: regionId
    }
    return KingdomRegionControllerService.addKingdomRegionRelation(kingdomId, regionId)
      .then(() => {
        addNewRegionToKingdom(kingdomId, entryDTO);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err.body);
        throw err
      });
  }

  const removeRegionFromKingdomFunction = async (kingdomId: number, regionId: number): Promise<void> => {
    return KingdomRegionControllerService.removeKingdomRegionRelation(kingdomId, regionId)
      .then(() => {
        removeRegionFromKingdom(kingdomId, regionId);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { saveNewRegionToKingdom, saveExistingRegionToKingdom, removeRegionFromKingdomFunction, getAllRegionsWithoutKingdom };
}