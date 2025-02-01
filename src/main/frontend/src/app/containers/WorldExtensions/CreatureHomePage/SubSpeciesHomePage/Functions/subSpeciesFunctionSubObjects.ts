
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, SubSpeciesDTO, RegionSubSpeciesControllerService, OpenAPI } from "../../../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../../../components/types"
import useJWTManager from "../../../../../../services/jwt/JWTMenager"

interface IAddSubObjectPayload {
  subSpeciesId: number,
  subObjectDTO: EntryDTO
}

interface IRegionSubObjectIdsPayload {
  subSpeciesId: number,
  subObjectId: number
}

interface ISubSpeciesubObjectsFunction {
  name: string
}

export function SubSpeciesFunctionSubObjects(props: ISubSpeciesubObjectsFunction) {
  const queryClient = useQueryClient()

  const saveNewRegionToSubSpeciesMutation = useMutation({
    mutationFn: (saveDescriptionToSubSpecies: IAddSubObjectPayload) =>
      RegionSubSpeciesControllerService.addNewRegionSubSpeciesRelation(saveDescriptionToSubSpecies.subSpeciesId, saveDescriptionToSubSpecies.subObjectDTO),
  })

  const saveNewRegionToSubSpecies = async (subSpeciesId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewRegionToSubSpeciesMutation.mutateAsync({ subSpeciesId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["subSpecies", props.name], (oldData: SubSpeciesDTO) => {
        const newData = oldData;
        newData.regions?.push(res)
        return newData
      })
    })
  }

  const saveRegionToSubSpeciesMutation = useMutation({
    mutationFn: (saveDescriptionToSubSpecies: IRegionSubObjectIdsPayload) =>
      RegionSubSpeciesControllerService.addRegionSubSpeciesRelation(saveDescriptionToSubSpecies.subObjectId, saveDescriptionToSubSpecies.subSpeciesId),
  })

  const saveExistingRegionToSubSpecies = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveRegionToSubSpeciesMutation.mutateAsync({ subSpeciesId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["subSpecies", props.name], (oldData: SubSpeciesDTO) => {
        const newData = oldData;
        newData.regions?.push(entryDTO)
        return newData
      })
    })
  }

  const removeRegionFromSubSpeciesMutation = useMutation({
    mutationFn: (saveDescriptionToSubSpecies: IRegionSubObjectIdsPayload) =>
      RegionSubSpeciesControllerService.deleteRegionSubSpeciesRelation(saveDescriptionToSubSpecies.subObjectId, saveDescriptionToSubSpecies.subSpeciesId),
  })

  const removeRegionFromSubSpeciesFunction = async (subSpeciesId: number, regionId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removeRegionFromSubSpeciesMutation.mutateAsync({ subSpeciesId, subObjectId: regionId }).then(() => {
      queryClient.setQueryData(["subSpecies", props.name], (oldData: SubSpeciesDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.regions?.filter(region => region.id !== regionId)
        } : oldData
        return newData
      })
    })
  }

  return {
    saveNewRegionToSubSpecies, saveExistingRegionToSubSpecies, removeRegionFromSubSpeciesFunction
  };
}