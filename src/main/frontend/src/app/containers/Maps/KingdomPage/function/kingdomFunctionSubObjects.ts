import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntryDTO, EntryFullDTO, KingdomRegionControllerService, OpenAPI } from "../../../../../services/openapi";
import { addExistingObjectToRelation } from "../../../../components/types";
import useJWTManager from "../../../../../services/jwt/JWTMenager";

interface IAddSubObjectPayload {
  kingdomId: number,
  subObjectDTO: EntryDTO
}

interface IKingdomSubObjectIdsPayload {
  kingdomId: number,
  subObjectId: number
}

interface IKingdomFunctionSubObjects {
  name: string
}


export function KingdomFunctionSubObjects(props: IKingdomFunctionSubObjects) {
  const queryClient = useQueryClient()

  const getAllRegionsWithoutKingdom = async () => {
    return await KingdomRegionControllerService.getAllRegionsWithoutKingdom()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const saveNewRegionToKingdomMutation = useMutation({
    mutationFn: (saveDescriptionToKingdom: IAddSubObjectPayload) => KingdomRegionControllerService.addNewRegionKingdomRelation(saveDescriptionToKingdom.kingdomId, saveDescriptionToKingdom.subObjectDTO),
  })

  const saveNewRegionToKingdom = async (kingdomId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewRegionToKingdomMutation.mutateAsync({ kingdomId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["kingdom", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData;
        newData.subObjects?.push(res)
        return newData
      })
    })
  }

  const saveRegionToKingdomMutation = useMutation({
    mutationFn: (saveDescriptionToKingdom: IKingdomSubObjectIdsPayload) => KingdomRegionControllerService.addKingdomRegionRelation(saveDescriptionToKingdom.kingdomId, saveDescriptionToKingdom.subObjectId),
  })

  const saveExistingRegionToKingdom = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveRegionToKingdomMutation.mutateAsync({ kingdomId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["kingdom", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData;
        newData.subObjects?.push(entryDTO)
        return newData
      })

    })
  }

  const removeRegionFromKingdomMutation = useMutation({
    mutationFn: (saveDescriptionToKingdom: IKingdomSubObjectIdsPayload) => KingdomRegionControllerService.removeKingdomRegionRelation(saveDescriptionToKingdom.kingdomId, saveDescriptionToKingdom.subObjectId),
  })

  const removeRegionFromKingdomFunction = async (kingdomId: number, regionId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removeRegionFromKingdomMutation.mutateAsync({ kingdomId, subObjectId: regionId }).then(_ => {
      queryClient.setQueryData(["kingdom", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.subObjects?.filter(region => region.id !== regionId)
        } : oldData
        return newData
      })
    })
  }

  return {
    getAllRegionsWithoutKingdom,
    removeRegionFromKingdomFunction, saveNewRegionToKingdom, saveExistingRegionToKingdom
  };
}