
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntryDTO, RegionDTO, CountyControllerService, OpenAPI, CountyRegionControllerService } from "../../../../../services/openapi";
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

interface IRegionFunctionCounties {
    name: string
}


export function RegionFunctionCounties(props: IRegionFunctionCounties) {
    const queryClient = useQueryClient()

    const getAllCounties = async () => {
        return await CountyControllerService.getAllCounties()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const saveNewCountyToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IAddSubObjectPayload) => CountyRegionControllerService.addNewCountyRegionRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectDTO),
    })

    const saveNewCountyToRegion = async (regionId: number, name: string, shortDescription: string): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return saveNewCountyToRegionMutation.mutateAsync({ regionId, subObjectDTO: entryDTO }).then(res => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData;
                newData.counties?.push(res)
                return newData
            })
        })
    }

    const saveCountyToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IRegionSubObjectIdsPayload) => CountyRegionControllerService.addCountyRegionRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectId),
    })

    const saveExistingCountyToRegion = async (args: addExistingObjectToRelation): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: args.objectName,
            shortDescription: args.objectDescription,
            id: args.objectToAddId
        }
        return saveCountyToRegionMutation.mutateAsync({ regionId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData;
                newData.counties?.push(entryDTO)
                return newData
            })

        })
    }

    const removeCountyFromRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IRegionSubObjectIdsPayload) => CountyRegionControllerService.removeCountyRegionRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectId),
    })

    const removeCountyFromRegionFunction = async (regionId: number, countyId: number): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return removeCountyFromRegionMutation.mutateAsync({ regionId, subObjectId: countyId }).then(_ => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    subObjects: oldData.counties?.filter(county => county.id !== countyId)
                } : oldData
                return newData
            })
        })
    }

    return {
        getAllCounties,
        removeCountyFromRegionFunction, saveNewCountyToRegion, saveExistingCountyToRegion
    };
}