
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntryDTO, RegionDTO, RegionPlaceControllerService } from "../../../../../services/openapi";
import { addExistingObjectToRelation } from "../../../../components/types";

interface IAddSubObjectPayload {
    regionId: number,
    subObjectDTO: EntryDTO
}

interface IRegionSubObjectIdsPayload {
    regionId: number,
    subObjectId: number
}

interface IRegionFunctionPlaces {
    name: string
}


export function RegionFunctionPlaces(props: IRegionFunctionPlaces) {
    const queryClient = useQueryClient()

    const getAllPlacesWithoutRegion = async () => {
        return await RegionPlaceControllerService.getAllPlacesWithoutRegion()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const saveNewPlaceToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IAddSubObjectPayload) => RegionPlaceControllerService.addNewPlaceRegionRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectDTO),
    })

    const saveNewPlaceToRegion = async (regionId: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return saveNewPlaceToRegionMutation.mutateAsync({ regionId, subObjectDTO: entryDTO }).then(res => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData;
                newData.places?.push(res)
                return newData
            })
        })
    }

    const savePlaceToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IRegionSubObjectIdsPayload) => RegionPlaceControllerService.addRegionPlaceRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectId),
    })

    const saveExistingPlaceToRegion = async (args: addExistingObjectToRelation): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: args.objectName,
            shortDescription: args.objectDescription,
            id: args.objectToAddId
        }
        return savePlaceToRegionMutation.mutateAsync({ regionId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData;
                newData.places?.push(entryDTO)
                return newData
            })
        })
    }

    const removePlaceFromRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IRegionSubObjectIdsPayload) => RegionPlaceControllerService.removeRegionPlaceRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectId),
    })

    const removePlaceFromRegionFunction = async (regionId: number, placeId: number): Promise<void> => {
        return removePlaceFromRegionMutation.mutateAsync({ regionId, subObjectId: placeId }).then(_ => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    subObjects: oldData.places?.filter(place => place.id !== placeId)
                } : oldData
                return newData
            })
        })
    }

    return {
        getAllPlacesWithoutRegion,
        removePlaceFromRegionFunction, saveNewPlaceToRegion, saveExistingPlaceToRegion
    };
}