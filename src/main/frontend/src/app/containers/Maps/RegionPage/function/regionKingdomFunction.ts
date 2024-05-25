import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, EntryDTO, KingdomControllerService, KingdomRegionControllerService } from "../../../../../services/openapi";
import { useAppDispatch } from "../../../../hooks";
import { removeKingdomFromRegion, setKingdomToRegion } from "../store/regionPageSlice";

const actionDispatch = (dispatch: Dispatch) => ({
  setKingdomToRegion: (regionId: number, kingdomDTO: EntryDTO) => {
    dispatch(setKingdomToRegion({
        regionId,
        kingdomDTO
    }))
  },
  removeKingdomFromRegion: (regionId: number, kingdomId: number) => {
    dispatch(removeKingdomFromRegion({
        regionId,
        subObjectId: kingdomId
    }))
  }
})

export function RegionKingdomFunction() {
  const { setKingdomToRegion, removeKingdomFromRegion } = actionDispatch(useAppDispatch());

  const setNewKingdomToRegion = async (regionId: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      description: description
    }
    return KingdomRegionControllerService.addNewKingdomRegionRelation(regionId, entryDTO)
      .then((result) => {
        setKingdomToRegion(regionId, result);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const setExistingKingdomToRegion = async (regionId: number, kingdomId: number, kingdomName: string, kingdomDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: kingdomName,
      description: kingdomDescription,
      id: kingdomId
    }
    return KingdomRegionControllerService.addKingdomRegionRelation(kingdomId, regionId)
      .then(() => {
        setKingdomToRegion(regionId, entryDTO);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err.body);
        throw err
      });
  }

  const getAllKingdoms = async () => {
    return await KingdomControllerService.getAllKingdoms()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const removeKingdomFromRegionFunction = async (regionId: number, kingdomId: number): Promise<void> => {
    return KingdomRegionControllerService.removeKingdomRegionRelation(kingdomId, regionId)
      .then(() => {
        removeKingdomFromRegion(regionId, kingdomId);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { setNewKingdomToRegion, setExistingKingdomToRegion, getAllKingdoms, removeKingdomFromRegionFunction };
}