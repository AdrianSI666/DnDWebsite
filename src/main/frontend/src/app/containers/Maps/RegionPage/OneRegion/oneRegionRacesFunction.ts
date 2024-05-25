
import { ApiError, EntryDTO, RaceControllerService, RegionRaceControllerService } from "../../../../../services/openapi"
import { OneRegionDispatcher } from "./store/dispatcher";

export function OneRegionRacesFunction() {
    const { addNewRaceToRegion, removeRaceFromRegion } = OneRegionDispatcher();
    const saveNewRaceToRegion = async (regionId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return RegionRaceControllerService.addNewRaceRegionRelation(regionId, entryDTO)
            .then((res) => {
                addNewRaceToRegion(res);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingRaceToRegion = async (regionId: number, raceId: number, raceName: string, raceDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: raceName,
            description: raceDescription,
            id: raceId
        }
        return RegionRaceControllerService.addRegionRaceRelation(regionId, raceId)
            .then(() => {
                addNewRaceToRegion(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllRaces = async () => {
        return await RaceControllerService.getAllRaces()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removeRaceFromRegionFunction = async (regionId: number, raceId: number): Promise<void> => {
        return RegionRaceControllerService.deleteRegionRaceRelation(regionId, raceId)
            .then(() => {
                removeRaceFromRegion(raceId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewRaceToRegion, saveExistingRaceToRegion, removeRaceFromRegionFunction, getAllRaces };
}