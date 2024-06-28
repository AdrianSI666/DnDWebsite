
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, SubRaceDTO, RegionSubRaceControllerService } from "../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../components/types"

interface IAddSubObjectPayload {
  subRaceId: number,
  subObjectDTO: EntryDTO
}

interface IRegionSubObjectIdsPayload {
  subRaceId: number,
  subObjectId: number
}

interface ISubRaceSubObjectsFunction {
  name: string
}

export function SubRaceFunctionSubObjects(props: ISubRaceSubObjectsFunction) {
  const queryClient = useQueryClient()

  const saveNewRegionToSubRaceMutation = useMutation({
    mutationFn: (saveDescriptionToSubRace: IAddSubObjectPayload) =>
      RegionSubRaceControllerService.addNewRegionSubRaceRelation(saveDescriptionToSubRace.subRaceId, saveDescriptionToSubRace.subObjectDTO),
  })

  const saveNewRegionToSubRace = async (subRaceId: number, name: string, shortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewRegionToSubRaceMutation.mutateAsync({ subRaceId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["subRace", props.name], (oldData: SubRaceDTO) => {
        const newData = oldData;
        newData.regions?.push(res)
        return newData
      })
    })
  }

  const saveRegionToSubRaceMutation = useMutation({
    mutationFn: (saveDescriptionToSubRace: IRegionSubObjectIdsPayload) =>
      RegionSubRaceControllerService.addRegionSubRaceRelation(saveDescriptionToSubRace.subObjectId, saveDescriptionToSubRace.subRaceId),
  })

  const saveExistingRegionToSubRace = async (args: addExistingObjectToRelation): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveRegionToSubRaceMutation.mutateAsync({ subRaceId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["subRace", props.name], (oldData: SubRaceDTO) => {
        const newData = oldData;
        newData.regions?.push(entryDTO)
        return newData
      })
    })
  }

  const removeRegionFromSubRaceMutation = useMutation({
    mutationFn: (saveDescriptionToSubRace: IRegionSubObjectIdsPayload) =>
      RegionSubRaceControllerService.deleteRegionSubRaceRelation(saveDescriptionToSubRace.subObjectId, saveDescriptionToSubRace.subRaceId),
  })

  const removeRegionFromSubRaceFunction = async (subRaceId: number, regionId: number): Promise<void> => {
    return removeRegionFromSubRaceMutation.mutateAsync({ subRaceId, subObjectId: regionId }).then(() => {
      queryClient.setQueryData(["subRace", props.name], (oldData: SubRaceDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.regions?.filter(region => region.id !== regionId)
        } : oldData
        return newData
      })
    })
  }

  return {
    saveNewRegionToSubRace, saveExistingRegionToSubRace, removeRegionFromSubRaceFunction
  };
}