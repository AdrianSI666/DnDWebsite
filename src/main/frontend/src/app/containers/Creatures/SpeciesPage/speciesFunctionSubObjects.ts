
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, OpenAPI, SpeciesDTO, SpeciesSubSpeciesControllerService, RegionSpeciesControllerService } from "../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../components/types"
import useJWTManager from "../../../../services/jwt/JWTMenager"

interface IAddSubObjectPayload {
  speciesId: number,
  subObjectDTO: EntryDTO
}

interface ISpeciesubObjectIdsPayload {
  speciesId: number,
  subObjectId: number
}

interface ISpeciesubObjectsFunction {
  name: string
}

export function SpeciesFunctionSubObjects(props: ISpeciesubObjectsFunction) {
  const queryClient = useQueryClient()

  const getAllSubSpecies = async () => {
    return await SpeciesSubSpeciesControllerService.getAllSubSpeciesWithoutSpecies()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const saveNewSubSpeciesToSpeciesMutation = useMutation({
    mutationFn: (saveDescriptionToSpecies: IAddSubObjectPayload) => SpeciesSubSpeciesControllerService.addNewSubSpeciesRelation(saveDescriptionToSpecies.speciesId, saveDescriptionToSpecies.subObjectDTO),
  })

  const saveNewSubSpeciesToSpecies = async (speciesId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewSubSpeciesToSpeciesMutation.mutateAsync({ speciesId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
        const newData = oldData;
        newData.subSpecies?.push(res)
        return newData
      })
    })
  }

  const saveSubSpeciesToSpeciesMutation = useMutation({
    mutationFn: (saveDescriptionToSpecies: ISpeciesubObjectIdsPayload) => SpeciesSubSpeciesControllerService.addSubSpeciesRelationSpecies(saveDescriptionToSpecies.speciesId, saveDescriptionToSpecies.subObjectId),
  })

  const saveExistingSubSpeciesToSpecies = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveSubSpeciesToSpeciesMutation.mutateAsync({ speciesId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
        const newData = oldData;
        newData.subSpecies?.push(entryDTO)
        return newData
      })

    })
  }

  const removeSubSpeciesFromSpeciesMutation = useMutation({
    mutationFn: (saveDescriptionToSpecies: ISpeciesubObjectIdsPayload) => SpeciesSubSpeciesControllerService.removeSubSpeciesRelationSpecies(saveDescriptionToSpecies.speciesId, saveDescriptionToSpecies.subObjectId),
  })

  const removeSubSpeciesFromSpeciesFunction = async (speciesId: number, subSpeciesId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removeSubSpeciesFromSpeciesMutation.mutateAsync({ speciesId, subObjectId: subSpeciesId }).then(_ => {
      queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.subSpecies?.filter(subSpecies => subSpecies.id !== subSpeciesId)
        } : oldData
        return newData
      })
    })
  }

  const saveNewRegionToSpeciesMutation = useMutation({
    mutationFn: (saveDescriptionToSpecies: IAddSubObjectPayload) => RegionSpeciesControllerService.addNewRegionSpeciesRelation(saveDescriptionToSpecies.speciesId, saveDescriptionToSpecies.subObjectDTO),
  })

  const saveNewRegionToSpecies = async (speciesId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewRegionToSpeciesMutation.mutateAsync({ speciesId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
        const newData = oldData;
        newData.regions?.push(res)
        return newData
      })
    })
  }

  const saveRegionToSpeciesMutation = useMutation({
    mutationFn: (saveDescriptionToSpecies: ISpeciesubObjectIdsPayload) => RegionSpeciesControllerService.addRegionSpeciesRelation(saveDescriptionToSpecies.subObjectId, saveDescriptionToSpecies.speciesId),
  })

  const saveExistingRegionToSpecies = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveRegionToSpeciesMutation.mutateAsync({ speciesId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
        const newData = oldData;
        newData.regions?.push(entryDTO)
        return newData
      })
    })
  }

  const removeRegionFromSpeciesMutation = useMutation({
    mutationFn: (saveDescriptionToSpecies: ISpeciesubObjectIdsPayload) => RegionSpeciesControllerService.deleteRegionSpeciesRelation(saveDescriptionToSpecies.subObjectId, saveDescriptionToSpecies.speciesId),
  })

  const removeRegionFromSpeciesFunction = async (speciesId: number, regionId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removeRegionFromSpeciesMutation.mutateAsync({ speciesId, subObjectId: regionId }).then(() => {
      queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.regions?.filter(region => region.id !== regionId)
        } : oldData
        return newData
      })
    })
  }

  return {
    getAllSubSpecies,
    removeSubSpeciesFromSpeciesFunction, saveNewSubSpeciesToSpecies, saveExistingSubSpeciesToSpecies,
    saveNewRegionToSpecies, saveExistingRegionToSpecies, removeRegionFromSpeciesFunction
  };
}