
import { ApiError, EntryDTO, RaceControllerService, RegionRaceControllerService } from "../../../../../services/openapi";

interface IRegionRaceProps {
    addNewRaceToRegion?: (regionId: number, subObjectDTO: EntryDTO) => void
    addNewRaceToOneRegion?: (subObjectDTO: EntryDTO) => void
    removeRaceFromRegion?: (regionId: number, raceId: number) => void
    removeRaceFromOneRegion?: (raceId: number) => void
}

export function RegionRacesFunction(props: IRegionRaceProps) {
    const getAllRaces = async () => {
        return await RaceControllerService.getAllRaces()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const saveNewRaceToRegion = async (regionId: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return RegionRaceControllerService.addNewRaceRegionRelation(regionId, entryDTO)
            .then((result) => {
                if(props.addNewRaceToRegion)props.addNewRaceToRegion(regionId, result);
                else if(props.addNewRaceToOneRegion) props.addNewRaceToOneRegion(result);
                else throw new Error("Didn't sepcify dispatch action when adding new race to region relation.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingRaceToRegion = async (regionId: number, raceId: number, raceName: string, raceDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: raceName,
            shortDescription: raceDescription,
            id: raceId
        }
        return RegionRaceControllerService.addRegionRaceRelation(regionId, raceId)
            .then(() => {
                if(props.addNewRaceToRegion)props.addNewRaceToRegion(regionId, entryDTO);
                else if(props.addNewRaceToOneRegion) props.addNewRaceToOneRegion(entryDTO);
                else throw new Error("Didn't sepcify dispatch action when adding existing race to region relation.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const removeRaceFromRegionFunction = async (regionId: number, raceId: number): Promise<void> => {
        return RegionRaceControllerService.deleteRegionRaceRelation(regionId, raceId)
            .then(() => {
                if(props.removeRaceFromRegion)props.removeRaceFromRegion(regionId, raceId);
                else if(props.removeRaceFromOneRegion) props.removeRaceFromOneRegion(raceId);
                else throw new Error("Didn't sepcify dispatch action when removing race from region relation.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewRaceToRegion, saveExistingRaceToRegion, removeRaceFromRegionFunction, getAllRaces };
}