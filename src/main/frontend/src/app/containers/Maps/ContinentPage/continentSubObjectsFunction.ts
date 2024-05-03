
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, EntryDTO, ContinentKingdomControllerService } from "../../../../services/openapi";
import { useAppDispatch } from "../../../hooks";
import { addNewKingdomToContinent, removeKingdomFromContinent } from "./store/continentPageSlice";

const actionDispatch = (dispatch: Dispatch) => ({
  addNewKingdomToContinent: (continentId: number, kingdomDTO: EntryDTO) => {
    dispatch(addNewKingdomToContinent({
        continentId,
      kingdomDTO
    }))
  },
  removeKingdomFromContinent: (continentId: number, kingdomId: number) => {
    dispatch(removeKingdomFromContinent({
        continentId,
        subObjectId: kingdomId
    }))
  }
})

export function ContinentSubObjectsFunction() {
  const { addNewKingdomToContinent, removeKingdomFromContinent } = actionDispatch(useAppDispatch());

  const getAllKingdomsWithoutContinent = async () => {
    return await ContinentKingdomControllerService.getAllKingdomsWithoutContinent()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const saveNewKingdomToContinent = async (continentId: number, name: string, description: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      description: description
    }
    return ContinentKingdomControllerService.addNewKingdomContinentRelation(continentId, entryDTO)
      .then((result) => {
        addNewKingdomToContinent(continentId, result);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  const saveExistingKingdomToContinent = async (continentId: number, kingdomId: number, kingdomName: string, kingdomDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: kingdomName,
      description: kingdomDescription,
      id: kingdomId
    }
    return ContinentKingdomControllerService.addContinentKingdomRelation(continentId, kingdomId)
      .then(() => {
        addNewKingdomToContinent(continentId, entryDTO);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err.body);
        throw err
      });
  }

  const removeKingdomFromContinentFunction = async (continentId: number, kingdomId: number): Promise<void> => {
    return ContinentKingdomControllerService.removeContinentKingdomRelation(continentId, kingdomId)
      .then(() => {
        removeKingdomFromContinent(continentId, kingdomId);
      })
      .catch((err: ApiError) => {
        console.log("My Error: ", err);
        throw err
      });
  }

  return { saveNewKingdomToContinent, saveExistingKingdomToContinent, removeKingdomFromContinentFunction, getAllKingdomsWithoutContinent };
}