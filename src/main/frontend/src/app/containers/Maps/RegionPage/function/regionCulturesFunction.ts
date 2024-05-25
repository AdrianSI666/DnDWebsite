
import { Dispatch } from "@reduxjs/toolkit";
import { ApiError, CultureControllerService, EntryDTO, RegionCultureControllerService } from "../../../../../services/openapi";
import { useAppDispatch } from "../../../../hooks";
import { addNewCultureToRegion, removeCultureFromRegion } from "../store/regionPageSlice";

const actionDispatch = (dispatch: Dispatch) => ({
    addNewCultureToRegion: (regionId: number, subObjectDTO: EntryDTO) => {
        dispatch(addNewCultureToRegion({
            regionId,
            subObjectDTO
        }))
    },
    removeCultureFromRegion: (regionId: number, cultureId: number) => {
        dispatch(removeCultureFromRegion({
            regionId,
            subObjectId: cultureId
        }))
    }
})

export function RegionCulturesFunction() {
    const { addNewCultureToRegion, removeCultureFromRegion } = actionDispatch(useAppDispatch());

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
                addNewCultureToRegion(regionId, result);
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
                addNewCultureToRegion(regionId, entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const removeCultureFromRegionFunction = async (regionId: number, cultureId: number): Promise<void> => {
        return RegionCultureControllerService.deleteRegionCultureRelation(regionId, cultureId)
            .then(() => {
                removeCultureFromRegion(regionId, cultureId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { saveNewCultureToRegion, saveExistingCultureToRegion, removeCultureFromRegionFunction, getAllCultures };
}