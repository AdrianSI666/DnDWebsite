
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntryDTO, RegionDTO, RegionCultureControllerService, CultureControllerService, OpenAPI } from "../../../../../services/openapi";
import { addExistingObjectToRelation } from "../../../../components/types";
import useJWTManager from "../../../../../services/jwt/JWTMenager";

interface IAddSubObjectPayload {
    regionId: number,
    subObjectDTO: EntryDTO
}

interface IRegionSubObjectIdsPayload {
    regionId: number,
    subObjectId: number
}

interface IRegionFunctionCultures {
    name: string
}


export function RegionFunctionCultures(props: IRegionFunctionCultures) {
    const queryClient = useQueryClient()

    const getAllCultures = async () => {
        return await CultureControllerService.getAllCultures()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const saveNewCultureToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IAddSubObjectPayload) => RegionCultureControllerService.addNewCultureRegionRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectDTO),
    })

    const saveNewCultureToRegion = async (regionId: number, name: string, shortDescription: string): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return saveNewCultureToRegionMutation.mutateAsync({ regionId, subObjectDTO: entryDTO }).then(res => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData;
                newData.cultures?.push(res)
                return newData
            })
        })
    }

    const saveCultureToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IRegionSubObjectIdsPayload) => RegionCultureControllerService.addRegionCultureRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectId),
    })

    const saveExistingCultureToRegion = async (args: addExistingObjectToRelation): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: args.objectName,
            shortDescription: args.objectDescription,
            id: args.objectToAddId
        }
        return saveCultureToRegionMutation.mutateAsync({ regionId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData;
                newData.cultures?.push(entryDTO)
                return newData
            })

        })
    }

    const removeCultureFromRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IRegionSubObjectIdsPayload) => RegionCultureControllerService.deleteRegionCultureRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectId),
    })

    const removeCultureFromRegionFunction = async (regionId: number, cultureId: number): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return removeCultureFromRegionMutation.mutateAsync({ regionId, subObjectId: cultureId }).then(_ => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    subObjects: oldData.cultures?.filter(culture => culture.id !== cultureId)
                } : oldData
                return newData
            })
        })
    }

    return {
        getAllCultures,
        removeCultureFromRegionFunction, saveNewCultureToRegion, saveExistingCultureToRegion
    };
}