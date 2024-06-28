
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntryDTO, RegionDTO, RegionRaceControllerService, RaceControllerService } from "../../../../../services/openapi";
import { addExistingObjectToRelation } from "../../../../components/types";

interface IAddSubObjectPayload {
    regionId: number,
    subObjectDTO: EntryDTO
}

interface IRegionSubObjectIdsPayload {
    regionId: number,
    subObjectId: number
}

interface IRegionFunctionRaces {
    name: string
}


export function RegionFunctionRaces(props: IRegionFunctionRaces) {
    const queryClient = useQueryClient()

    const getAllRaces = async () => {
        return await RaceControllerService.getAllRaces()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const saveNewRaceToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IAddSubObjectPayload) => RegionRaceControllerService.addNewRaceRegionRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectDTO),
    })

    const saveNewRaceToRegion = async (regionId: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return saveNewRaceToRegionMutation.mutateAsync({ regionId, subObjectDTO: entryDTO }).then(res => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData;
                newData.races?.push(res)
                return newData
            })
        })
    }

    const saveRaceToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IRegionSubObjectIdsPayload) => RegionRaceControllerService.addRegionRaceRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectId),
    })

    const saveExistingRaceToRegion = async (args: addExistingObjectToRelation): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: args.objectName,
            shortDescription: args.objectDescription,
            id: args.objectToAddId
        }
        return saveRaceToRegionMutation.mutateAsync({ regionId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData;
                newData.races?.push(entryDTO)
                return newData
            })

        })
    }

    const removeRaceFromRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IRegionSubObjectIdsPayload) => RegionRaceControllerService.deleteRegionRaceRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectId),
    })

    const removeRaceFromRegionFunction = async (regionId: number, raceId: number): Promise<void> => {
        return removeRaceFromRegionMutation.mutateAsync({ regionId, subObjectId: raceId }).then(_ => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    subObjects: oldData.races?.filter(race => race.id !== raceId)
                } : oldData
                return newData
            })
        })
    }

    return {
        getAllRaces,
        removeRaceFromRegionFunction, saveNewRaceToRegion, saveExistingRaceToRegion
    };
}