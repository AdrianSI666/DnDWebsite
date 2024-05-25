import { ApiError, EntryDTO, KingdomControllerService, KingdomRegionControllerService } from "../../../../../services/openapi"
import { OneRegionDispatcher } from "./store/dispatcher";

export function OneRegionKingdomFunction() {
    const { setKingdomToRegion, removeKingdomFromRegion } = OneRegionDispatcher();

    const setNewKingdomToRegion = async (regionId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return KingdomRegionControllerService.addNewKingdomRegionRelation(regionId, entryDTO)
            .then((result) => {
                setKingdomToRegion(result);
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
                setKingdomToRegion(entryDTO);
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
                removeKingdomFromRegion();
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { setNewKingdomToRegion, setExistingKingdomToRegion, removeKingdomFromRegionFunction, getAllKingdoms };
}
