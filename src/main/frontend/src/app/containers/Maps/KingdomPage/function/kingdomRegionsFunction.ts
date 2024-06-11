import { ApiError, EntryDTO, KingdomRegionControllerService } from "../../../../../services/openapi";

interface IKingdomRegionsFunction {
  addNewRegionToKingdom?: (regionId: number, subObjectDTO: EntryDTO) => void
  addNewRegionToOneKingdom?: (subObjectDTO: EntryDTO) => void
  removeRegionFromKingdom?: (regionId: number, placeId: number) => void
  removeRegionFromOneKingdom?: (placeId: number) => void
}

export function KingdomRegionsFunction(props: IKingdomRegionsFunction) {
  const getAllRegionsWithoutKingdom = async () => {
    return await KingdomRegionControllerService.getAllRegionsWithoutKingdom()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const saveNewRegionToKingdom = async (kingdomId: number, name: string, shortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return KingdomRegionControllerService.addNewRegionKingdomRelation(kingdomId, entryDTO)
      .then((result) => {
        if (props.addNewRegionToKingdom) props.addNewRegionToKingdom(kingdomId, result);
        else if (props.addNewRegionToOneKingdom) props.addNewRegionToOneKingdom(result);
        else throw new Error("Didn't sepcify dispatch action when adding new region to kingdom relation.");
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const saveExistingRegionToKingdom = async (kingdomId: number, regionId: number, regionName: string, regionDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: regionName,
      shortDescription: regionDescription,
      id: regionId
    }
    return KingdomRegionControllerService.addKingdomRegionRelation(kingdomId, regionId)
      .then(() => {
        if (props.addNewRegionToKingdom) props.addNewRegionToKingdom(kingdomId, entryDTO);
        else if (props.addNewRegionToOneKingdom) props.addNewRegionToOneKingdom(entryDTO);
        else throw new Error("Didn't sepcify dispatch action when adding existing region to kingdom relation.");
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err.body);
        throw err
      });
  }

  const removeRegionFromKingdomFunction = async (kingdomId: number, regionId: number): Promise<void> => {
    return KingdomRegionControllerService.removeKingdomRegionRelation(kingdomId, regionId)
      .then(() => {
        if (props.removeRegionFromKingdom) props.removeRegionFromKingdom(kingdomId, regionId);
        else if (props.removeRegionFromOneKingdom) props.removeRegionFromOneKingdom(regionId);
        else throw new Error("Didn't sepcify dispatch action when removing region from kingdom relation.");
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { saveNewRegionToKingdom, saveExistingRegionToKingdom, removeRegionFromKingdomFunction, getAllRegionsWithoutKingdom };
}