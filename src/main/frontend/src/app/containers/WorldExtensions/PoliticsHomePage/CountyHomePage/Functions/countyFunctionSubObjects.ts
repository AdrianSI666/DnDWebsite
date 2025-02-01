import { useMutation, useQueryClient } from "@tanstack/react-query";

import useJWTManager from "../../../../../../services/jwt/JWTMenager";
import { CountyRegionControllerService, EntryDTO, EntryFullDTO, OpenAPI } from "../../../../../../services/openapi";
import { addExistingObjectToRelation } from "../../../../../components/types";

interface IAddSubObjectPayload {
  countyId: number,
  subObjectDTO: EntryDTO
}

interface ICountySubObjectIdsPayload {
  countyId: number,
  subObjectId: number
}

interface ICountyFunctionSubObjects {
  name: string
}


export function CountyFunctionSubObjects(props: ICountyFunctionSubObjects) {
  const queryClient = useQueryClient()

  const saveNewRegionToCountyMutation = useMutation({
    mutationFn: (saveDescriptionToCounty: IAddSubObjectPayload) => CountyRegionControllerService.addNewRegionCountyRelation(saveDescriptionToCounty.countyId, saveDescriptionToCounty.subObjectDTO),
  })

  const saveNewRegionToCounty = async (countyId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewRegionToCountyMutation.mutateAsync({ countyId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["county", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData;
        newData.subObjects?.push(res)
        return newData
      })
    })
  }

  const saveRegionToCountyMutation = useMutation({
    mutationFn: (saveDescriptionToCounty: ICountySubObjectIdsPayload) => CountyRegionControllerService.addCountyRegionRelation(saveDescriptionToCounty.countyId, saveDescriptionToCounty.subObjectId),
  })

  const saveExistingRegionToCounty = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveRegionToCountyMutation.mutateAsync({ countyId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["county", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData;
        newData.subObjects?.push(entryDTO)
        return newData
      })

    })
  }

  const removeRegionFromCountyMutation = useMutation({
    mutationFn: (saveDescriptionToCounty: ICountySubObjectIdsPayload) => CountyRegionControllerService.removeCountyRegionRelation(saveDescriptionToCounty.countyId, saveDescriptionToCounty.subObjectId),
  })

  const removeRegionFromCountyFunction = async (countyId: number, regionId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removeRegionFromCountyMutation.mutateAsync({ countyId, subObjectId: regionId }).then(_ => {
      queryClient.setQueryData(["county", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.subObjects?.filter(region => region.id !== regionId)
        } : oldData
        return newData
      })
    })
  }

  return {
    removeRegionFromCountyFunction, saveNewRegionToCounty, saveExistingRegionToCounty
  };
}