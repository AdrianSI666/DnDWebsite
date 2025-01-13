
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useJWTManager from "../../../../services/jwt/JWTMenager";
import { CreatureTypeDTO, CreatureTypeSpeciesControllerService, EntryDTO, OpenAPI, PlaneControllerService, PlaneCreatureTypeControllerService, SpeciesControllerService } from "../../../../services/openapi";
import { addExistingObjectToRelation } from "../../../components/types";

interface IAddSubObjectPayload {
  creaturetypeId: number,
  subObjectDTO: EntryDTO
}

interface IRemoveSubObjectPayload {
  creaturetypeId: number,
  subObjectId: number
}

interface ITypesubObjectsFunction {
  name: string
}

export function TypeFunctionSubObjects(props: ITypesubObjectsFunction) {
  const queryClient = useQueryClient()

  const getAllSpecies = async () => {
    return await SpeciesControllerService.getAllSpecies()
        .catch((err) => {
            console.log("My Error: ", err);
        });
}

  const saveNewSpeciesToTypeMutation = useMutation({
    mutationFn: (saveDescriptionToType: IAddSubObjectPayload) => CreatureTypeSpeciesControllerService.addNewSpeciesRelation1(saveDescriptionToType.creaturetypeId, saveDescriptionToType.subObjectDTO),
  })

  const saveNewSpeciesToType = async (typeId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewSpeciesToTypeMutation.mutateAsync({ creaturetypeId: typeId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["creatureType", props.name], (oldData: CreatureTypeDTO) => {
        const newData = oldData;
        newData.species?.push(res)
        return newData
      })
    })
  }

  const saveSpeciesToTypeMutation = useMutation({
    mutationFn: (saveDescriptionToType: IRemoveSubObjectPayload) => CreatureTypeSpeciesControllerService.addSpeciesRelationCreatureType(saveDescriptionToType.subObjectId, saveDescriptionToType.creaturetypeId),
  })

  const saveExistingSpeciesToType = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveSpeciesToTypeMutation.mutateAsync({ creaturetypeId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["creatureType", props.name], (oldData: CreatureTypeDTO) => {
        const newData = oldData;
        newData.species?.push(entryDTO)
        return newData
      })
    })
  }

  const removeSpeciesFromTypeMutation = useMutation({
    mutationFn: (saveDescriptionToType: IRemoveSubObjectPayload) => CreatureTypeSpeciesControllerService.removeSpeciesRelationCreatureType(saveDescriptionToType.subObjectId, saveDescriptionToType.creaturetypeId),
  })

  const removeSpeciesFromTypeFunction = async (typeId: number, speciesId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removeSpeciesFromTypeMutation.mutateAsync({ creaturetypeId: typeId, subObjectId: speciesId }).then(() => {
      queryClient.setQueryData(["creatureType", props.name], (oldData: CreatureTypeDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.species?.filter(species => species.id !== speciesId)
        } : oldData
        return newData
      })
    })
  }

  const saveNewPlaneToCreatureTypeMutation = useMutation({
    mutationFn: (saveDescriptionToCreatureType: IAddSubObjectPayload) => PlaneCreatureTypeControllerService.addNewPlaneCreatureTypeRelation(saveDescriptionToCreatureType.creaturetypeId, saveDescriptionToCreatureType.subObjectDTO),
  })

  const saveNewPlaneToCreatureType = async (creatureTypeId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewPlaneToCreatureTypeMutation.mutateAsync({ creaturetypeId: creatureTypeId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["creatureType", props.name], (oldData: CreatureTypeDTO) => {
        const newData = oldData;
        newData.planes?.push(res)
        return newData
      })
    })
  }

  const savePlaneToCreatureTypeMutation = useMutation({
    mutationFn: (saveDescriptionToCreatureType: IRemoveSubObjectPayload) => PlaneCreatureTypeControllerService.addPlaneCreatureTypeRelation(saveDescriptionToCreatureType.subObjectId, saveDescriptionToCreatureType.creaturetypeId),
  })

  const saveExistingPlaneToCreatureType = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return savePlaneToCreatureTypeMutation.mutateAsync({ creaturetypeId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["creatureType", props.name], (oldData: CreatureTypeDTO) => {
        const newData = oldData;
        newData.planes?.push(entryDTO)
        return newData
      })
    })
  }

  const removePlaneFromCreatureTypeMutation = useMutation({
    mutationFn: (saveDescriptionToCreatureType: IRemoveSubObjectPayload) => PlaneCreatureTypeControllerService.deletePlaneCreatureTypeRelation(saveDescriptionToCreatureType.subObjectId, saveDescriptionToCreatureType.creaturetypeId),
  })

  const removePlaneFromCreatureTypeFunction = async (creaturetypeId: number, planeId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removePlaneFromCreatureTypeMutation.mutateAsync({ creaturetypeId, subObjectId: planeId }).then(() => {
      queryClient.setQueryData(["creatureType", props.name], (oldData: CreatureTypeDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.planes?.filter(plane => plane.id !== planeId)
        } : oldData
        return newData
      })
    })
  }

  const getAllPlanes = async () => {
    return await PlaneControllerService.getAllPlanes()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  return { getAllSpecies, saveNewSpeciesToType, saveExistingSpeciesToType, removeSpeciesFromTypeFunction, saveNewPlaneToCreatureType, saveExistingPlaneToCreatureType, removePlaneFromCreatureTypeFunction, getAllPlanes };
}