
import { ApiError, ContinentControllerService, ContinentKingdomControllerService, EntryDTO } from "../../../../../services/openapi";

interface IKingdomDomContinentFunction {
  setContinentToKingdom?: (kingdomId: number, continentDTO: EntryDTO) => void
  setContinentToOneKingdom?: (continentDTO: EntryDTO) => void
  removeContinentFromKingdom?: (kingdomId: number, continentId: number) => void
  removeContinentFromOneKingdom?: (continentId: number) => void
}

export function KingdomDomContinentFunction(props: IKingdomDomContinentFunction) {
  const setNewContinentToKingdom = async (kingdomId: number, name: string, shortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return ContinentKingdomControllerService.addNewContinentKingdomRelation(kingdomId, entryDTO)
      .then((result) => {
        if (props.setContinentToKingdom) props.setContinentToKingdom(kingdomId, result);
        else if (props.setContinentToOneKingdom) props.setContinentToOneKingdom(result);
        else throw new Error("Didn't sepcify dispatch action when adding new continent to kingdom relation.");
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const setExistingContinentToKingdom = async (kingdomId: number, continentId: number, continentName: string, continentDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: continentName,
      shortDescription: continentDescription,
      id: continentId
    }
    console.log(kingdomId)
    return ContinentKingdomControllerService.addContinentKingdomRelation(continentId, kingdomId)
      .then(() => {
        if (props.setContinentToKingdom) props.setContinentToKingdom(kingdomId, entryDTO);
        else if (props.setContinentToOneKingdom) props.setContinentToOneKingdom(entryDTO);
        else throw new Error("Didn't sepcify dispatch action when adding existing continent to kingdom relation.");
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err.body);
        throw err
      });
  }

  const getAllContinents = async () => {
    return await ContinentControllerService.getAllContinents()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const removeContinentFromKingdomFunction = async (kingdomId: number, continentId: number): Promise<void> => {
    return ContinentKingdomControllerService.removeContinentKingdomRelation(continentId, kingdomId)
      .then(() => {
        if (props.removeContinentFromKingdom) props.removeContinentFromKingdom(kingdomId, continentId);
        else if (props.removeContinentFromOneKingdom) props.removeContinentFromOneKingdom(continentId);
        else throw new Error("Didn't sepcify dispatch action when removing continent from kingdom relation.");
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { setNewContinentToKingdom, setExistingContinentToKingdom, getAllContinents, removeContinentFromKingdomFunction };
}