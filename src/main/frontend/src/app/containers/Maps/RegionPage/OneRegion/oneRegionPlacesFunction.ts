
import { ApiError, EntryDTO, RegionPlaceControllerService } from "../../../../../services/openapi"
import { OneRegionDispatcher } from "./store/dispatcher";

export function OneRegionPlacesFunction() {
    const { addNewPlaceToRegion, removePlaceFromRegion } = OneRegionDispatcher();
    const saveNewPlaceToRegion = async (regionId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return RegionPlaceControllerService.addNewPlaceRegionRelation(regionId, entryDTO)
            .then((res) => {
                addNewPlaceToRegion(res);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingPlaceToRegion = async (regionId: number, placeId: number, placeName: string, placeDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: placeName,
            description: placeDescription,
            id: placeId
        }
        return RegionPlaceControllerService.addRegionPlaceRelation(regionId, placeId)
            .then(() => {
                addNewPlaceToRegion(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllPlacesWithoutRegion = async () => {
        return await RegionPlaceControllerService.getAllPlacesWithoutRegion()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removePlaceFromRegionFunction = async (regionId: number, placeId: number): Promise<void> => {
        return RegionPlaceControllerService.removeRegionPlaceRelation(regionId, placeId)
            .then(() => {
                removePlaceFromRegion(placeId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewPlaceToRegion, saveExistingPlaceToRegion, removePlaceFromRegionFunction, getAllPlacesWithoutRegion };
}