
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useJWTManager from "../../../../../../services/jwt/JWTMenager"
import { ContinentDTO, ContinentKingdomControllerService, ContinentRegionControllerService, EntryDTO, OpenAPI } from "../../../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../../../components/types"

interface IAddSubObjectPayload {
  continentId: number,
  subObjectDTO: EntryDTO
}

interface IContinentSubObjectIdsPayload {
  continentId: number,
  subObjectId: number
}

interface IContinentFunctionSubObjects {
  name: string
}

export function ContinentFunctionSubObjects(props: IContinentFunctionSubObjects) {
  const queryClient = useQueryClient()

  const saveNewKingdomToContinentMutation = useMutation({
    mutationFn: (saveDescriptionToContinent: IAddSubObjectPayload) =>
      ContinentKingdomControllerService.addNewKingdomContinentRelation(saveDescriptionToContinent.continentId, saveDescriptionToContinent.subObjectDTO),
  })

  const saveNewKingdomToContinent = async (continentId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let kingdomDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewKingdomToContinentMutation.mutateAsync({ continentId, subObjectDTO: kingdomDTO }).then(res => {
      queryClient.setQueryData(["continent", props.name], (oldData: ContinentDTO) => {
        const newData = oldData;
        newData.kingdoms?.push(res)
        return newData
      })
    })
  }

  const saveKingdomToContinentMutation = useMutation({
    mutationFn: (saveDescriptionToContinent: IContinentSubObjectIdsPayload) =>
      ContinentKingdomControllerService.addContinentKingdomRelation(saveDescriptionToContinent.continentId, saveDescriptionToContinent.subObjectId),
  })

  const saveExistingKingdomToContinent = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let kingdomDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveKingdomToContinentMutation.mutateAsync({ continentId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["continent", props.name], (oldData: ContinentDTO) => {
        const newData = oldData;
        newData.kingdoms?.push(kingdomDTO)
        return newData
      })

    })
  }

  const removeKingdomFromContinentMutation = useMutation({
    mutationFn: (saveDescriptionToContinent: IContinentSubObjectIdsPayload) =>
      ContinentKingdomControllerService.removeContinentKingdomRelation(saveDescriptionToContinent.continentId, saveDescriptionToContinent.subObjectId),
  })

  const removeKingdomFromContinentFunction = async (continentId: number, kingdomId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removeKingdomFromContinentMutation.mutateAsync({ continentId, subObjectId: kingdomId }).then(_ => {
      queryClient.setQueryData(["continent", props.name], (oldData: ContinentDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.kingdoms?.filter(kingdom => kingdom.id !== kingdomId)
        } : oldData
        return newData
      })
    })
  }

  const saveNewRegionToContinentMutation = useMutation({
    mutationFn: (saveDescriptionToContinent: IAddSubObjectPayload) =>
      ContinentRegionControllerService.addNewRegionContinentRelation(saveDescriptionToContinent.continentId, saveDescriptionToContinent.subObjectDTO),
  })

  const saveNewRegionToContinent = async (continentId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let regionDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewRegionToContinentMutation.mutateAsync({ continentId, subObjectDTO: regionDTO }).then(res => {
      queryClient.setQueryData(["continent", props.name], (oldData: ContinentDTO) => {
        const newData = oldData;
        newData.regions?.push(res)
        return newData
      })
    })
  }

  const saveRegionToContinentMutation = useMutation({
    mutationFn: (saveDescriptionToContinent: IContinentSubObjectIdsPayload) =>
      ContinentRegionControllerService.addContinentRegionRelation(saveDescriptionToContinent.continentId, saveDescriptionToContinent.subObjectId),
  })

  const saveExistingRegionToContinent = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let regionDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveRegionToContinentMutation.mutateAsync({ continentId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["continent", props.name], (oldData: ContinentDTO) => {
        const newData = oldData;
        newData.regions?.push(regionDTO)
        return newData
      })

    })
  }

  const removeRegionFromContinentMutation = useMutation({
    mutationFn: (saveDescriptionToContinent: IContinentSubObjectIdsPayload) =>
      ContinentRegionControllerService.removeContinentRegionRelation(saveDescriptionToContinent.continentId, saveDescriptionToContinent.subObjectId),
  })

  const removeRegionFromContinentFunction = async (continentId: number, regionId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removeRegionFromContinentMutation.mutateAsync({ continentId, subObjectId: regionId }).then(_ => {
      queryClient.setQueryData(["continent", props.name], (oldData: ContinentDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.regions?.filter(region => region.id !== regionId)
        } : oldData
        return newData
      })
    })
  }

  return {
    removeKingdomFromContinentFunction, saveNewKingdomToContinent, saveExistingKingdomToContinent,
    removeRegionFromContinentFunction, saveNewRegionToContinent, saveExistingRegionToContinent
  };
}