
import { ApiError, CultureControllerService, EntryDTO, RegionCultureControllerService } from "../../../../../services/openapi";

interface IRegionCultureProps {
    addNewCultureToRegion?: (regionId: number, subObjectDTO: EntryDTO) => void
    addNewCultureToOneRegion?: (subObjectDTO: EntryDTO) => void
    removeCultureFromRegion?: (regionId: number, cultureId: number) => void
    removeCultureFromOneRegion?: (cultureId: number) => void
}


export function RegionCulturesFunction(props: IRegionCultureProps) {
    
    const getAllCultures = async () => {
        return await CultureControllerService.getAllCultures()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const saveNewCultureToRegion = async (regionId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return RegionCultureControllerService.addNewCultureRegionRelation(regionId, entryDTO)
            .then((result) => {
                if(props.addNewCultureToRegion)props.addNewCultureToRegion(regionId, result);
                else if(props.addNewCultureToOneRegion) props.addNewCultureToOneRegion(result);
                else throw new Error("Didn't sepcify dispatch action when adding new culture to region relation.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingCultureToRegion = async (regionId: number, cultureId: number, cultureName: string, cultureDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: cultureName,
            description: cultureDescription,
            id: cultureId
        }
        return RegionCultureControllerService.addRegionCultureRelation(regionId, cultureId)
            .then(() => {
                if(props.addNewCultureToRegion)props.addNewCultureToRegion(regionId, entryDTO);
                else if(props.addNewCultureToOneRegion) props.addNewCultureToOneRegion(entryDTO);
                else throw new Error("Didn't sepcify dispatch action when adding existing culture to region relation.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const removeCultureFromRegionFunction = async (regionId: number, cultureId: number): Promise<void> => {
        return RegionCultureControllerService.deleteRegionCultureRelation(regionId, cultureId)
            .then(() => {
                if(props.removeCultureFromRegion)props.removeCultureFromRegion(regionId, cultureId);
                else if(props.removeCultureFromOneRegion) props.removeCultureFromOneRegion(cultureId);
                else throw new Error("Didn't sepcify dispatch action when removing culture from region relation.");
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewCultureToRegion, saveExistingCultureToRegion, removeCultureFromRegionFunction, getAllCultures };
}