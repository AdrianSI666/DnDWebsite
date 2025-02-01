
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useJWTManager from "../../../../../../services/jwt/JWTMenager";
import { EntryDTO, OpenAPI, RegionDTO, RegionSubSpeciesControllerService } from "../../../../../../services/openapi";
import { addExistingObjectToRelation } from "../../../../../components/types";

interface IAddSubObjectPayload {
    regionId: number,
    subObjectDTO: EntryDTO
}

interface IRegionSubObjectIdsPayload {
    regionId: number,
    subObjectId: number
}

interface IRegionFunctionSubSpecies {
    name: string
}


export function RegionFunctionSubSpecies(props: IRegionFunctionSubSpecies) {
    const queryClient = useQueryClient()

    const saveNewSubSpeciesToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IAddSubObjectPayload) => RegionSubSpeciesControllerService.addNewSubSpeciesRegionRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectDTO),
    })

    const saveNewSubSpeciesToRegion = async (regionId: number, name: string, shortDescription: string): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        return saveNewSubSpeciesToRegionMutation.mutateAsync({ regionId, subObjectDTO: entryDTO }).then(res => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData;
                newData.subSpecies?.push(res)
                return newData
            })
        })
    }

    const saveSubSpeciesToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IRegionSubObjectIdsPayload) => RegionSubSpeciesControllerService.addRegionSubSpeciesRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectId),
    })

    const saveExistingSubSpeciesToRegion = async (args: addExistingObjectToRelation): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: args.objectName,
            shortDescription: args.objectDescription,
            id: args.objectToAddId
        }
        return saveSubSpeciesToRegionMutation.mutateAsync({ regionId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData;
                newData.subSpecies?.push(entryDTO)
                return newData
            })

        })
    }

    const removeSubSpeciesFromRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IRegionSubObjectIdsPayload) => RegionSubSpeciesControllerService.deleteRegionSubSpeciesRelation(saveDescriptionToRegion.regionId, saveDescriptionToRegion.subObjectId),
    })

    const removeSubSpeciesFromRegionFunction = async (regionId: number, subspeciesId: number): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return removeSubSpeciesFromRegionMutation.mutateAsync({ regionId, subObjectId: subspeciesId }).then(_ => {
            queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    subObjects: oldData.subSpecies?.filter(subSpecies => subSpecies.id !== subspeciesId)
                } : oldData
                return newData
            })
        })
    }

    return {
        removeSubSpeciesFromRegionFunction, saveNewSubSpeciesToRegion, saveExistingSubSpeciesToRegion
    };
}