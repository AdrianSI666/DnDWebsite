
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntryDTO, RegionDTO, RegionSpeciesControllerService, SpeciesControllerService, OpenAPI } from "../../../../../services/openapi";
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

interface IRegionFunctionSpecies {
    name: string
}


export function RegionFunctionSpecies(props: IRegionFunctionSpecies) {
    const queryClient = useQueryClient()

    const getAllSpecies = async () => {
        return await SpeciesControllerService.getAllSpecies()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const saveNewSpeciesToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IAddSubObjectPayload) => RegionSpeciesControllerService.addNewSpeciesRegionRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectDTO),
    })

    const saveNewSpeciesToRegion = async (regionId: number, name: string, shortDescription: string): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return saveNewSpeciesToRegionMutation.mutateAsync({ regionId, subObjectDTO: entryDTO }).then(res => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData;
                newData.species?.push(res)
                return newData
            })
        })
    }

    const saveSpeciesToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IRegionSubObjectIdsPayload) => RegionSpeciesControllerService.addRegionSpeciesRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectId),
    })

    const saveExistingSpeciesToRegion = async (args: addExistingObjectToRelation): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: args.objectName,
            shortDescription: args.objectDescription,
            id: args.objectToAddId
        }
        return saveSpeciesToRegionMutation.mutateAsync({ regionId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData;
                newData.species?.push(entryDTO)
                return newData
            })

        })
    }

    const removeSpeciesFromRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IRegionSubObjectIdsPayload) => RegionSpeciesControllerService.deleteRegionSpeciesRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectId),
    })

    const removeSpeciesFromRegionFunction = async (regionId: number, speciesId: number): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return removeSpeciesFromRegionMutation.mutateAsync({ regionId, subObjectId: speciesId }).then(_ => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    subObjects: oldData.species?.filter(species => species.id !== speciesId)
                } : oldData
                return newData
            })
        })
    }

    return {
        getAllSpecies,
        removeSpeciesFromRegionFunction, saveNewSpeciesToRegion, saveExistingSpeciesToRegion
    };
}