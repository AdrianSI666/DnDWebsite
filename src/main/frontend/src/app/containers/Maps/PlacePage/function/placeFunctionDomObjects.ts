
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntryDTO, EntryFullDTO, RegionControllerService, RegionPlaceControllerService } from "../../../../../services/openapi";
import { addExistingObjectToRelation } from "../../../../components/types";

interface IAddDomObjectPayload {
  placeId: number,
  domObjectDTO: EntryDTO
}

interface IPlaceSubObjectIdsPayload {
  placeId: number,
  subObjectId: number
}

interface IPlaceFunctionDomObjects {
  name: string
}


export function PlaceFunctionDomObjects(props: IPlaceFunctionDomObjects) {
  const queryClient = useQueryClient()

  const getAllRegions = async () => {
    return await RegionControllerService.getAllRegions()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const setNewRegionToPlaceMutation = useMutation({
    mutationFn: (payload: IAddDomObjectPayload) =>
      RegionPlaceControllerService.addNewRegionPlaceRelation(payload.placeId, payload.domObjectDTO),
  })

  const setNewRegionToPlace = async (placeId: number, name: string, shortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    setNewRegionToPlaceMutation.mutateAsync({ placeId, domObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["place", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData;
        newData.domObjects = res
        return newData
      })
    })
  }

  const setRegionToPlaceMutation = useMutation({
    mutationFn: (payload: IPlaceSubObjectIdsPayload) => RegionPlaceControllerService.addRegionPlaceRelation(payload.subObjectId, payload.placeId),
  })

  const setExistingRegionToPlace = async (args: addExistingObjectToRelation): Promise<void> => {
    let regionDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    console.log("function")
    console.log("region", args.objectToAddId)
    console.log("place", args.coreObjectId)
    console.log("service")
    return setRegionToPlaceMutation.mutateAsync({ placeId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["place", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData;
        newData.domObjects = regionDTO
        return newData
      })

    })
  }

  const removeRegionFromPlaceMutation = useMutation({
    mutationFn: (payload: IPlaceSubObjectIdsPayload) =>
      RegionPlaceControllerService.removeRegionPlaceRelation(payload.subObjectId, payload.placeId),
  })

  const removeRegionFromPlaceFunction = async (regionId: number, placeId: number): Promise<void> => {
    return removeRegionFromPlaceMutation.mutateAsync({ placeId, subObjectId: regionId }).then(_ => {
      queryClient.setQueryData(["place", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData ? {
          ...oldData,
          region: {}
        } : oldData
        return newData
      })
    })
  }

  return { setNewRegionToPlace, setExistingRegionToPlace, removeRegionFromPlaceFunction, getAllRegions };
}