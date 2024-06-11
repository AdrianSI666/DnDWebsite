import { ApiError, EntryDTO, KingdomControllerService, KingdomRegionControllerService } from "../../../../../services/openapi";

interface IRegionKingdomProps {
  setKingdomToRegion?: (regionId: number, kingdomDTO: EntryDTO) => void
  setKingdomToOneRegion?: (kingdomDTO: EntryDTO) => void
  removeKingdomFromRegion?: (regionId: number, kingdomId: number) => void
  removeKingdomFromOneRegion?: (kingdomId: number) => void
}

export function RegionKingdomFunction(props: IRegionKingdomProps) {

  const setNewKingdomToRegion = async (regionId: number, name: string, shortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return KingdomRegionControllerService.addNewKingdomRegionRelation(regionId, entryDTO)
      .then((result) => {
        if (props.setKingdomToRegion) props.setKingdomToRegion(regionId, result);
        else if (props.setKingdomToOneRegion) props.setKingdomToOneRegion(result);
        else throw new Error("Didn't sepcify dispatch action when adding new kingodm to region relation.");
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const setExistingKingdomToRegion = async (regionId: number, kingdomId: number, kingdomName: string, kingdomDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: kingdomName,
      shortDescription: kingdomDescription,
      id: kingdomId
    }
    return KingdomRegionControllerService.addKingdomRegionRelation(kingdomId, regionId)
      .then(() => {
        if (props.setKingdomToRegion) props.setKingdomToRegion(regionId, entryDTO);
        else if (props.setKingdomToOneRegion) props.setKingdomToOneRegion(entryDTO);
        else throw new Error("Didn't sepcify dispatch action when adding existing kingdom to region relation.");
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
        if (props.removeKingdomFromRegion) props.removeKingdomFromRegion(regionId, kingdomId);
        else if (props.removeKingdomFromOneRegion) props.removeKingdomFromOneRegion(kingdomId);
        else throw new Error("Didn't sepcify dispatch action when removing kingdom from region relation.");
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { setNewKingdomToRegion, setExistingKingdomToRegion, getAllKingdoms, removeKingdomFromRegionFunction };
}