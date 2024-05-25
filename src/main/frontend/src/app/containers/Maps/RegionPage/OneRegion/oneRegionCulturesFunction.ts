
import { ApiError, CultureControllerService, EntryDTO, RegionCultureControllerService } from "../../../../../services/openapi"
import { OneRegionDispatcher } from "./store/dispatcher";

export function OneRegionCulturesFunction() {
    const { addNewCultureToRegion, removeCultureFromRegion } = OneRegionDispatcher();
    const saveNewCultureToRegion = async (regionId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return RegionCultureControllerService.addNewCultureRegionRelation(regionId, entryDTO)
            .then((res) => {
                addNewCultureToRegion(res);
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
                addNewCultureToRegion(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllCultures = async () => {
        return await CultureControllerService.getAllCultures()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removeCultureFromRegionFunction = async (regionId: number, cultureId: number): Promise<void> => {
        return RegionCultureControllerService.deleteRegionCultureRelation(regionId, cultureId)
            .then(() => {
                removeCultureFromRegion(cultureId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewCultureToRegion, saveExistingCultureToRegion, removeCultureFromRegionFunction, getAllCultures };
}