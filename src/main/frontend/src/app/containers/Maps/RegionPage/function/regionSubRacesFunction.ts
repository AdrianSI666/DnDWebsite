
import { ApiError, EntryDTO, RegionSubRaceControllerService, SubRaceControllerService } from "../../../../../services/openapi";

interface IRegionSubRaceProps {
    addNewSubRaceToRegion?: (regionId: number, subObjectDTO: EntryDTO) => void
    addNewSubRaceToOneRegion?: (subObjectDTO: EntryDTO) => void
    removeSubRaceFromRegion?: (regionId: number, subRaceId: number) => void
    removeSubRaceFromOneRegion?: (subRaceId: number) => void
}

export function RegionSubRacesFunction(props: IRegionSubRaceProps) {
    const getAllSubRaces = async () => {
        return await SubRaceControllerService.getAllSubRaces()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const saveNewSubRaceToRegion = async (regionId: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return RegionSubRaceControllerService.addNewSubRaceRegionRelation(regionId, entryDTO)
            .then((result) => {
                if(props.addNewSubRaceToRegion)props.addNewSubRaceToRegion(regionId, result);
                else if(props.addNewSubRaceToOneRegion) props.addNewSubRaceToOneRegion(result);
                else throw new Error("Didn't sepcify dispatch action when adding new sub race to region relation.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingSubRaceToRegion = async (regionId: number, subSubRaceId: number, subSubRaceName: string, subSubRaceDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: subSubRaceName,
            shortDescription: subSubRaceDescription,
            id: subSubRaceId
        }
        return RegionSubRaceControllerService.addRegionSubRaceRelation(regionId, subSubRaceId)
            .then(() => {
                if(props.addNewSubRaceToRegion)props.addNewSubRaceToRegion(regionId, entryDTO);
                else if(props.addNewSubRaceToOneRegion) props.addNewSubRaceToOneRegion(entryDTO);
                else throw new Error("Didn't sepcify dispatch action when adding existing sub race to region relation.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const removeSubRaceFromRegionFunction = async (regionId: number, subSubRaceId: number): Promise<void> => {
        return RegionSubRaceControllerService.deleteRegionSubRaceRelation(regionId, subSubRaceId)
            .then(() => {
                if(props.removeSubRaceFromRegion)props.removeSubRaceFromRegion(regionId, subSubRaceId);
                else if(props.removeSubRaceFromOneRegion) props.removeSubRaceFromOneRegion(subSubRaceId);
                else throw new Error("Didn't sepcify dispatch action when removing sub race from region relation.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewSubRaceToRegion, saveExistingSubRaceToRegion, removeSubRaceFromRegionFunction, getAllSubRaces };
}