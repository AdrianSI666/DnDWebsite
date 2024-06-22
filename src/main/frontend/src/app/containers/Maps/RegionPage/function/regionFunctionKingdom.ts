import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntryDTO, KingdomControllerService, KingdomRegionControllerService, RegionDTO } from "../../../../../services/openapi";
import { addExistingObjectToRelation } from "../../../../components/types";

interface IAddDomObjectPayload {
  regionId: number,
  domObjectDTO: EntryDTO
}

interface IRegionSubObjectIdsPayload {
  regionId: number,
  subObjectId: number
}

interface IRegionFunctionKingdom {
  name: string
}

export function RegionFunctionKingdom(props: IRegionFunctionKingdom) {
  const queryClient = useQueryClient()

  const getAllKingdoms = async () => {
    return await KingdomControllerService.getAllKingdoms()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const setNewKingdomToRegionMutation = useMutation({
    mutationFn: (payload: IAddDomObjectPayload) =>
      KingdomRegionControllerService.addNewKingdomRegionRelation(payload.regionId, payload.domObjectDTO),
  })

  const setNewKingdomToRegion = async (regionId: number, name: string, shortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    setNewKingdomToRegionMutation.mutateAsync({ regionId, domObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
        const newData = oldData;
        newData.kingdom = res
        return newData
      })
    })
  }

  const setKingdomToRegionMutation = useMutation({
    mutationFn: (payload: IRegionSubObjectIdsPayload) => KingdomRegionControllerService.addKingdomRegionRelation(payload.subObjectId, payload.regionId),
  })

  const setExistingKingdomToRegion = async (args: addExistingObjectToRelation): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return setKingdomToRegionMutation.mutateAsync({ regionId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
        const newData = oldData;
        newData.kingdom = entryDTO
        return newData
      })
    })
  }

  const removeKingdomFromRegionMutation = useMutation({
    mutationFn: (payload: IRegionSubObjectIdsPayload) =>
      KingdomRegionControllerService.removeKingdomRegionRelation(payload.subObjectId, payload.regionId),
  })

  const removeKingdomFromRegionFunction = async (kingdomId: number, regionId: number): Promise<void> => {
    return removeKingdomFromRegionMutation.mutateAsync({ regionId, subObjectId: kingdomId }).then(_ => {
      queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
        const newData = oldData ? {
          ...oldData,
          kingdom: {}
        } : oldData
        return newData
      })
    })
  }

  return { setNewKingdomToRegion, setExistingKingdomToRegion, removeKingdomFromRegionFunction, getAllKingdoms };
}