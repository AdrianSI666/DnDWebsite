
import { ApiError, EntryDTO, RegionPlaceControllerService } from "../../../../../services/openapi";

interface IRegionPlaceProps {
    addNewPlaceToRegion?: (regionId: number, subObjectDTO: EntryDTO) => void
    addNewPlaceToOneRegion?: (subObjectDTO: EntryDTO) => void
    removePlaceFromRegion?: (regionId: number, placeId: number) => void
    removePlaceFromOneRegion?: (placeId: number) => void
}

export function RegionPlacesFunction(props: IRegionPlaceProps) {
    const getAllPlacesWithoutRegion = async () => {
        return await RegionPlaceControllerService.getAllPlacesWithoutRegion()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const saveNewPlaceToRegion = async (regionId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return RegionPlaceControllerService.addNewPlaceRegionRelation(regionId, entryDTO)
            .then((result) => {
                if(props.addNewPlaceToRegion)props.addNewPlaceToRegion(regionId, result);
                else if(props.addNewPlaceToOneRegion) props.addNewPlaceToOneRegion(result);
                else throw new Error("Didn't sepcify dispatch action when adding new place to region relation.");
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
                if(props.addNewPlaceToRegion)props.addNewPlaceToRegion(regionId, entryDTO);
                else if(props.addNewPlaceToOneRegion) props.addNewPlaceToOneRegion(entryDTO);
                else throw new Error("Didn't sepcify dispatch action when adding existing place to region relation.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const removePlaceFromRegionFunction = async (regionId: number, placeId: number): Promise<void> => {
        return RegionPlaceControllerService.removeRegionPlaceRelation(regionId, placeId)
            .then(() => {
                if(props.removePlaceFromRegion)props.removePlaceFromRegion(regionId, placeId);
                else if(props.removePlaceFromOneRegion) props.removePlaceFromOneRegion(placeId);
                else throw new Error("Didn't sepcify dispatch action when removing place from region relation.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewPlaceToRegion, saveExistingPlaceToRegion, removePlaceFromRegionFunction, getAllPlacesWithoutRegion };
}