import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntryDTO, ContinentControllerService, ContinentRegionControllerService, OpenAPI, RegionDTO } from "../../../../../services/openapi";
import { addExistingObjectToRelation } from "../../../../components/types";
import useJWTManager from "../../../../../services/jwt/JWTMenager";

interface IAddDomObjectPayload {
  regionId: number,
  domObjectDTO: EntryDTO
}

interface IRegionSubObjectIdsPayload {
  regionId: number,
  subObjectId: number
}

interface IRegionFunctionContinent {
  name: string
}

export function RegionFunctionContinent(props: IRegionFunctionContinent) {
  const queryClient = useQueryClient()

  const getAllContinents = async () => {
    return await ContinentControllerService.getAllContinents()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const setNewContinentToRegionMutation = useMutation({
    mutationFn: (payload: IAddDomObjectPayload) =>
      ContinentRegionControllerService.addNewContinentRegionRelation(payload.regionId, payload.domObjectDTO),
  })

  const setNewContinentToRegion = async (regionId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    setNewContinentToRegionMutation.mutateAsync({ regionId, domObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
        const newData = oldData;
        newData.continent = res
        return newData
      })
    })
  }

  const setContinentToRegionMutation = useMutation({
    mutationFn: (payload: IRegionSubObjectIdsPayload) => ContinentRegionControllerService.addContinentRegionRelation(payload.subObjectId, payload.regionId),
  })

  const setExistingContinentToRegion = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return setContinentToRegionMutation.mutateAsync({ regionId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
        const newData = oldData;
        newData.continent = entryDTO
        return newData
      })
    })
  }

  const removeContinentFromRegionMutation = useMutation({
    mutationFn: (payload: IRegionSubObjectIdsPayload) =>
      ContinentRegionControllerService.removeContinentRegionRelation(payload.subObjectId, payload.regionId),
  })

  const removeContinentFromRegionFunction = async (continentId: number, regionId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removeContinentFromRegionMutation.mutateAsync({ regionId, subObjectId: continentId }).then(_ => {
      queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
        const newData = oldData ? {
          ...oldData,
          continent: {}
        } : oldData
        return newData
      })
    })
  }

  return { setNewContinentToRegion, setExistingContinentToRegion, removeContinentFromRegionFunction, getAllContinents };
}