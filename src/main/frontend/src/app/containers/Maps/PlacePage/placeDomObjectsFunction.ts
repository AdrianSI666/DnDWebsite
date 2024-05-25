
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, EntryDTO, RegionControllerService, RegionPlaceControllerService } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { removeRegionFromPlace, setRegionToPlace } from "./store/placePageSlice";

const actionDispatch = (dispatch: Dispatch) => ({
  setRegionToPlace: (placeId: number, regionDTO: EntryDTO) => {
    dispatch(setRegionToPlace({
      placeId,
      regionDTO
    }))
  },
  removeRegionFromPlace: (placeId: number, regionId: number) => {
    dispatch(removeRegionFromPlace({
      placeId,
      subObjectId: regionId
    }))
  }
})

export function PlaceDomObjectsFunction() {
  const { setRegionToPlace, removeRegionFromPlace } = actionDispatch(useAppDispatch());

  const setNewRegionToPlace = async (placeId: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      description: description
    }
    return RegionPlaceControllerService.addNewRegionPlaceRelation(placeId, entryDTO)
      .then((result) => {
        setRegionToPlace(placeId, result);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const setExistingRegionToPlace = async (placeId: number, regionId: number, regionName: string, regionDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: regionName,
      description: regionDescription,
      id: regionId
    }
    return RegionPlaceControllerService.addRegionPlaceRelation(regionId, placeId)
      .then(() => {
        setRegionToPlace(placeId, entryDTO);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err.body);
        throw err
      });
  }

  const getAllRegions = async () => {
    return await RegionControllerService.getAllRegions()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const removeRegionFromPlaceFunction = async (placeId: number, regionId: number): Promise<void> => {
    return RegionPlaceControllerService.removeRegionPlaceRelation(regionId, placeId)
      .then(() => {
        removeRegionFromPlace(placeId, regionId);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { setNewRegionToPlace, setExistingRegionToPlace, getAllRegions, removeRegionFromPlaceFunction };
}