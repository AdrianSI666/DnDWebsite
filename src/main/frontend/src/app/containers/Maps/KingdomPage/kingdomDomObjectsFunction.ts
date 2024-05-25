
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, EntryDTO, ContinentControllerService, ContinentKingdomControllerService } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { removeContinentFromKingdom, setContinentToKingdom } from "./store/kingdomPageSlice";

const actionDispatch = (dispatch: Dispatch) => ({
  setContinentToKingdom: (kingdomId: number, continentDTO: EntryDTO) => {
    dispatch(setContinentToKingdom({
        kingdomId,
        continentDTO
    }))
  },
  removeContinentFromKingdom: (kingdomId: number, continentId: number) => {
    dispatch(removeContinentFromKingdom({
        kingdomId,
        subObjectId: continentId
    }))
  }
})

export function KingdomDomObjectsFunction() {
  const { setContinentToKingdom, removeContinentFromKingdom } = actionDispatch(useAppDispatch());

  const setNewContinentToKingdom = async (kingdomId: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      description: description
    }
    return ContinentKingdomControllerService.addNewContinentKingdomRelation(kingdomId, entryDTO)
      .then((result) => {
        setContinentToKingdom(kingdomId, result);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const setExistingContinentToKingdom = async (kingdomId: number, continentId: number, continentName: string, continentDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: continentName,
      description: continentDescription,
      id: continentId
    }
    return ContinentKingdomControllerService.addContinentKingdomRelation(continentId, kingdomId)
      .then(() => {
        setContinentToKingdom(kingdomId, entryDTO);
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
        removeContinentFromKingdom(kingdomId, continentId);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { setNewContinentToKingdom, setExistingContinentToKingdom, getAllContinents, removeContinentFromKingdomFunction };
}