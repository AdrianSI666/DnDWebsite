
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntryDTO, OpenAPI, RegionDTO, RegionSubRaceControllerService, SubRaceControllerService } from "../../../../../services/openapi";
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

interface IRegionFunctionSubRaces {
    name: string
}


export function RegionFunctionSubRaces(props: IRegionFunctionSubRaces) {
    const queryClient = useQueryClient()

    const getAllSubRaces = async () => {
        return await SubRaceControllerService.getAllSubRaces()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const saveNewSubRaceToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IAddSubObjectPayload) => RegionSubRaceControllerService.addNewSubRaceRegionRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectDTO),
    })

    const saveNewSubRaceToRegion = async (regionId: number, name: string, shortDescription: string): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return saveNewSubRaceToRegionMutation.mutateAsync({ regionId, subObjectDTO: entryDTO }).then(res => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData;
                newData.subRaces?.push(res)
                return newData
            })
        })
    }

    const saveSubRaceToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IRegionSubObjectIdsPayload) => RegionSubRaceControllerService.addRegionSubRaceRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectId),
    })

    const saveExistingSubRaceToRegion = async (args: addExistingObjectToRelation): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: args.objectName,
            shortDescription: args.objectDescription,
            id: args.objectToAddId
        }
        return saveSubRaceToRegionMutation.mutateAsync({ regionId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData;
                newData.subRaces?.push(entryDTO)
                return newData
            })

        })
    }

    const removeSubRaceFromRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IRegionSubObjectIdsPayload) => RegionSubRaceControllerService.deleteRegionSubRaceRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectId),
    })

    const removeSubRaceFromRegionFunction = async (regionId: number, subraceId: number): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return removeSubRaceFromRegionMutation.mutateAsync({ regionId, subObjectId: subraceId }).then(_ => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    subObjects: oldData.subRaces?.filter(subRace => subRace.id !== subraceId)
                } : oldData
                return newData
            })
        })
    }

    return {
        getAllSubRaces,
        removeSubRaceFromRegionFunction, saveNewSubRaceToRegion, saveExistingSubRaceToRegion
    };
}