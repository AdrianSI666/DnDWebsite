
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, EntryFullDTO, ContinentKingdomControllerService, OpenAPI } from "../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../components/types"
import useJWTManager from "../../../../services/jwt/JWTMenager"

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

  const getAllKingdomsWithoutContinent = async () => {
    return await ContinentKingdomControllerService.getAllKingdomsWithoutContinent()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

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
      queryClient.setQueryData(["continent", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData;
        newData.subObjects?.push(res)
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
      queryClient.setQueryData(["continent", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData;
        newData.subObjects?.push(kingdomDTO)
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
      queryClient.setQueryData(["continent", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.subObjects?.filter(kingdom => kingdom.id !== kingdomId)
        } : oldData
        return newData
      })
    })
  }

  return {
    getAllKingdomsWithoutContinent,
    removeKingdomFromContinentFunction, saveNewKingdomToContinent, saveExistingKingdomToContinent
  };
}