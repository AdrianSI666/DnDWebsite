
import { ApiError, EntryDTO, SubRaceControllerService, RegionSubRaceControllerService } from "../../../../../services/openapi"
import { OneRegionDispatcher } from "./store/dispatcher";

export function OneRegionSubRacesFunction() {
    const { addNewSubRaceToRegion, removeSubRaceFromRegion } = OneRegionDispatcher();
    const saveNewSubRaceToRegion = async (regionId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return RegionSubRaceControllerService.addNewSubRaceRegionRelation(regionId, entryDTO)
            .then((res) => {
                addNewSubRaceToRegion(res);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingSubRaceToRegion = async (regionId: number, subRaceId: number, subRaceName: string, subRaceDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: subRaceName,
            description: subRaceDescription,
            id: subRaceId
        }
        return RegionSubRaceControllerService.addRegionSubRaceRelation(regionId, subRaceId)
            .then(() => {
                addNewSubRaceToRegion(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllSubRaces = async () => {
        return await SubRaceControllerService.getAllSubRaces()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removeSubRaceFromRegionFunction = async (regionId: number, subRaceId: number): Promise<void> => {
        return RegionSubRaceControllerService.deleteRegionSubRaceRelation(regionId, subRaceId)
            .then(() => {
                removeSubRaceFromRegion(subRaceId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewSubRaceToRegion, saveExistingSubRaceToRegion, removeSubRaceFromRegionFunction, getAllSubRaces };
}