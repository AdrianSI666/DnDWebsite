
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useJWTManager from "../../../../../../services/jwt/JWTMenager"
import { EntryDTO, OpenAPI, PlaneContinentControllerService, PlaneCreatureTypeControllerService, PlaneFullDTO } from "../../../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../../../components/types"

interface IAddSubObjectPayload {
  planeId: number,
  subObjectDTO: EntryDTO
}

interface IPlaneSubObjectIdsPayload {
  planeId: number,
  subObjectId: number
}

interface IPlaneFunctionSubObjects {
  name: string
}

export function PlaneFunctionSubObjects(props: IPlaneFunctionSubObjects) {
  const queryClient = useQueryClient()

  const saveNewContinentToPlaneMutation = useMutation({
    mutationFn: (saveDescriptionToPlane: IAddSubObjectPayload) => PlaneContinentControllerService.addNewContinentPlaneRelation(saveDescriptionToPlane.planeId, saveDescriptionToPlane.subObjectDTO),
  })

  const saveNewContinentToPlane = async (planeId: number, name: string, shortDescription: string): Promise<void> => {
    console.log(props)
    console.log("what")
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewContinentToPlaneMutation.mutateAsync({ planeId, subObjectDTO: entryDTO }).then(res => {
      console.log(res)
      queryClient.setQueryData(["plane", props.name], (oldData: PlaneFullDTO) => {
        const newData = oldData;
        newData.continents?.push(res)
        console.log(newData)
        return newData
      })
    })
  }

  const saveContinentToPlaneMutation = useMutation({
    mutationFn: (saveDescriptionToPlane: IPlaneSubObjectIdsPayload) => PlaneContinentControllerService.addPlaneContinentRelation(saveDescriptionToPlane.planeId, saveDescriptionToPlane.subObjectId),
  })

  const saveExistingContinentToPlane = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveContinentToPlaneMutation.mutateAsync({ planeId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["plane", props.name], (oldData: PlaneFullDTO) => {
        const newData = oldData;
        newData.continents?.push(entryDTO)
        return newData
      })
    })
  }

  const removeContinentFromPlaneMutation = useMutation({
    mutationFn: (saveDescriptionToPlane: IPlaneSubObjectIdsPayload) => PlaneContinentControllerService.removePlaneContinentRelation(saveDescriptionToPlane.planeId, saveDescriptionToPlane.subObjectId),
  })

  const removeContinentFromPlaneFunction = async (planeId: number, continentId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removeContinentFromPlaneMutation.mutateAsync({ planeId, subObjectId: continentId }).then(_ => {
      queryClient.setQueryData(["plane", props.name], (oldData: PlaneFullDTO) => {
        const newData = oldData ? {
          ...oldData,
          continents: oldData.continents?.filter(continent => continent.id !== continentId)
        } : oldData
        return newData
      })
    })
  }

  const saveNewCreatureTypesToPlaneMutation = useMutation({
    mutationFn: (saveDescriptionToPlane: IAddSubObjectPayload) => PlaneCreatureTypeControllerService.addNewCreatureTypePlaneRelation(saveDescriptionToPlane.planeId, saveDescriptionToPlane.subObjectDTO),
  })

  const saveNewCreatureTypeToPlane = async (planeId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewCreatureTypesToPlaneMutation.mutateAsync({ planeId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["plane", props.name], (oldData: PlaneFullDTO) => {
        const newData = oldData;
        newData.creatureTypes?.push(res)
        return newData
      })
    })
  }

  const saveCreatureTypesToPlaneMutation = useMutation({
    mutationFn: (saveDescriptionToPlane: IPlaneSubObjectIdsPayload) => PlaneCreatureTypeControllerService.addPlaneCreatureTypeRelation(saveDescriptionToPlane.planeId, saveDescriptionToPlane.subObjectId),
  })

  const saveExistingCreatureTypeToPlane = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveCreatureTypesToPlaneMutation.mutateAsync({ planeId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["plane", props.name], (oldData: PlaneFullDTO) => {
        const newData = oldData;
        newData.creatureTypes?.push(entryDTO)
        return newData
      })
    })
  }

  const removeCreatureTypesFromPlaneMutation = useMutation({
    mutationFn: (saveDescriptionToPlane: IPlaneSubObjectIdsPayload) => PlaneCreatureTypeControllerService.deletePlaneCreatureTypeRelation(saveDescriptionToPlane.planeId, saveDescriptionToPlane.subObjectId),
  })

  const removeCreatureTypeFromPlaneFunction = async (planeId: number, creaturetypesId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removeCreatureTypesFromPlaneMutation.mutateAsync({ planeId, subObjectId: creaturetypesId }).then(_ => {
      queryClient.setQueryData(["plane", props.name], (oldData: PlaneFullDTO) => {
        const newData = oldData ? {
          ...oldData,
          creatureTypes: oldData.creatureTypes?.filter(creaturetypes => creaturetypes.id !== creaturetypesId)
        } : oldData
        return newData
      })
    })
  }

  return {
    removeContinentFromPlaneFunction, saveNewContinentToPlane, saveExistingContinentToPlane,
    removeCreatureTypeFromPlaneFunction, saveNewCreatureTypeToPlane, saveExistingCreatureTypeToPlane
  };
}