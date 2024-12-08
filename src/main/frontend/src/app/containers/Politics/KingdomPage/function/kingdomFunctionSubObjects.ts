import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContinentControllerService, ContinentKingdomControllerService, EntryDTO, KingdomDTO, KingdomCountyControllerService, OpenAPI } from "../../../../../services/openapi";
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

  const getAllCountiesWithoutKingdom = async () => {
    return await KingdomCountyControllerService.getAllCountiesWithoutKingdom()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const saveNewCountyToKingdomMutation = useMutation({
    mutationFn: (saveDescriptionToKingdom: IAddSubObjectPayload) => KingdomCountyControllerService.addNewCountyKingdomRelation(saveDescriptionToKingdom.kingdomId, saveDescriptionToKingdom.subObjectDTO),
  })

  const saveNewCountyToKingdom = async (kingdomId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewCountyToKingdomMutation.mutateAsync({ kingdomId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["kingdom", props.name], (oldData: KingdomDTO) => {
        const newData = oldData;
        newData.counties?.push(res)
        return newData
      })
    })
  }

  const saveCountyToKingdomMutation = useMutation({
    mutationFn: (saveDescriptionToKingdom: IKingdomSubObjectIdsPayload) => KingdomCountyControllerService.addKingdomCountyRelation(saveDescriptionToKingdom.kingdomId, saveDescriptionToKingdom.subObjectId),
  })

  const saveExistingCountyToKingdom = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveCountyToKingdomMutation.mutateAsync({ kingdomId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["kingdom", props.name], (oldData: KingdomDTO) => {
        const newData = oldData;
        newData.counties?.push(entryDTO)
        return newData
      })

    })
  }

  const removeCountyFromKingdomMutation = useMutation({
    mutationFn: (saveDescriptionToKingdom: IKingdomSubObjectIdsPayload) => KingdomCountyControllerService.removeKingdomCountyRelation(saveDescriptionToKingdom.kingdomId, saveDescriptionToKingdom.subObjectId),
  })

  const removeCountyFromKingdomFunction = async (kingdomId: number, countyId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removeCountyFromKingdomMutation.mutateAsync({ kingdomId, subObjectId: countyId }).then(_ => {
      queryClient.setQueryData(["kingdom", props.name], (oldData: KingdomDTO) => {
        const newData = oldData ? {
          ...oldData,
          counties: oldData.counties?.filter(county => county.id !== countyId)
        } : oldData
        return newData
      })
    })
  }

  const getAllContinets = async () => {
    return await ContinentControllerService.getAllContinents()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const saveNewContinentToKingdomMutation = useMutation({
    mutationFn: (saveDescriptionToKingdom: IAddSubObjectPayload) => ContinentKingdomControllerService.addNewContinentKingdomRelation(saveDescriptionToKingdom.kingdomId, saveDescriptionToKingdom.subObjectDTO),
  })

  const saveNewContinentToKingdom = async (kingdomId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewContinentToKingdomMutation.mutateAsync({ kingdomId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["kingdom", props.name], (oldData: KingdomDTO) => {
        const newData = oldData;
        newData.continents?.push(res)
        return newData
      })
    })
  }

  const saveContinentToKingdomMutation = useMutation({
    mutationFn: (saveDescriptionToKingdom: IKingdomSubObjectIdsPayload) => ContinentKingdomControllerService.addContinentKingdomRelation(saveDescriptionToKingdom.kingdomId, saveDescriptionToKingdom.subObjectId),
  })

  const saveExistingContinentToKingdom = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveContinentToKingdomMutation.mutateAsync({ kingdomId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["kingdom", props.name], (oldData: KingdomDTO) => {
        const newData = oldData;
        newData.continents?.push(entryDTO)
        return newData
      })

    })
  }

  const removeContinentFromKingdomMutation = useMutation({
    mutationFn: (saveDescriptionToKingdom: IKingdomSubObjectIdsPayload) => ContinentKingdomControllerService.removeContinentKingdomRelation(saveDescriptionToKingdom.kingdomId, saveDescriptionToKingdom.subObjectId),
  })

  const removeContinentFromKingdomFunction = async (kingdomId: number, continentId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removeContinentFromKingdomMutation.mutateAsync({ kingdomId, subObjectId: continentId }).then(_ => {
      queryClient.setQueryData(["kingdom", props.name], (oldData: KingdomDTO) => {
        const newData = oldData ? {
          ...oldData,
          continents: oldData.continents?.filter(continent => continent.id !== continentId)
        } : oldData
        return newData
      })
    })
  }

  return {
    getAllCountiesWithoutKingdom,
    removeCountyFromKingdomFunction, saveNewCountyToKingdom, saveExistingCountyToKingdom,
    getAllContinets,
    removeContinentFromKingdomFunction, saveNewContinentToKingdom, saveExistingContinentToKingdom
  };
}