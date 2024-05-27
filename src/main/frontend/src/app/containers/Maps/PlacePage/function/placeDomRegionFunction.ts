
import { ApiError, EntryDTO, RegionControllerService, RegionPlaceControllerService } from "../../../../../services/openapi";

interface IPlaceDomRegionFunction {
  setRegionToPlace?: (placeId: number, regionDTO: EntryDTO) => void
  setRegionToOnePlace?: (regionDTO: EntryDTO) => void
  removeRegionFromPlace?: (placeId: number, regionId: number) => void
  removeRegionFromOnePlace?: (regionId: number) => void
}


export function PlaceDomRegionFunction(props: IPlaceDomRegionFunction) {

  const setNewRegionToPlace = async (placeId: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      description: description
    }
    return RegionPlaceControllerService.addNewRegionPlaceRelation(placeId, entryDTO)
      .then((result) => {
        if (props.setRegionToPlace) props.setRegionToPlace(placeId, result);
        else if (props.setRegionToOnePlace) props.setRegionToOnePlace(result);
        else throw new Error("Didn't sepcify dispatch action when adding new region to place relation.");
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
        if (props.setRegionToPlace) props.setRegionToPlace(placeId, entryDTO);
        else if (props.setRegionToOnePlace) props.setRegionToOnePlace(entryDTO);
        else throw new Error("Didn't sepcify dispatch action when adding existing region to place relation.");
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
        if (props.removeRegionFromPlace) props.removeRegionFromPlace(placeId, regionId);
        else if (props.removeRegionFromOnePlace) props.removeRegionFromOnePlace(regionId);
        else throw new Error("Didn't sepcify dispatch action when removing region from place relation.");
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { setNewRegionToPlace, setExistingRegionToPlace, getAllRegions, removeRegionFromPlaceFunction };
}