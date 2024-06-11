
import { Dispatch } from "@reduxjs/toolkit"
import { ApiError, EntryDTO, ContinentKingdomControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { addNewKingdomToContinent, removeKingdomFromContinent } from "./store/oneContinentSlice"

const actionDispatch = (dispatch: Dispatch) => ({
    addNewKingdomToContinent: (kingdomDTO: EntryDTO) => {
        dispatch(addNewKingdomToContinent(kingdomDTO))
    },
    removeKingdomFromContinent: (kingdomId: number) => {
        dispatch(removeKingdomFromContinent(kingdomId))
    }
})

export function OneContinentSubObjectsFunction() {
    const { addNewKingdomToContinent, removeKingdomFromContinent } = actionDispatch(useAppDispatch());
    const saveNewKingdomToContinent = async (continentId: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return ContinentKingdomControllerService.addNewKingdomContinentRelation(continentId, entryDTO)
            .then((res) => {
                addNewKingdomToContinent(res);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingKingdomToContinent = async (continentId: number, kingdomId: number, kingdomName: string, kingdomDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: kingdomName,
            shortDescription: kingdomDescription,
            id: kingdomId
        }
        return ContinentKingdomControllerService.addContinentKingdomRelation(continentId, kingdomId)
            .then(() => {
                addNewKingdomToContinent(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllKingdomsWithoutContinent = async () => {
        return await ContinentKingdomControllerService.getAllKingdomsWithoutContinent()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removeKingdomFromContinentFunction = async (continentId: number, kingdomId: number): Promise<void> => {
        return ContinentKingdomControllerService.removeContinentKingdomRelation(continentId, kingdomId)
            .then(() => {
                removeKingdomFromContinent(kingdomId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewKingdomToContinent, saveExistingKingdomToContinent, removeKingdomFromContinentFunction, getAllKingdomsWithoutContinent };
}