
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntryDTO, EntryFullDTO, RegionCultureControllerService } from "../../../services/openapi";
import { addExistingObjectToRelation } from "../../components/types";

interface IAddRegionPayload {
  cultureId: number,
  regionDTO: EntryDTO
}

interface IRemoveRegionPayload {
  cultureId: number,
  regionId: number
}

interface ICultureSubObjectsFunction {
  name: string
}

export function CultureFunctionSubObjects(props: ICultureSubObjectsFunction) {
  const queryClient = useQueryClient()
  const saveNewRegionToCultureMutation = useMutation({
    mutationFn: (saveDescriptionToCulture: IAddRegionPayload) => RegionCultureControllerService.addRegionCultureRelation(saveDescriptionToCulture.cultureId, saveDescriptionToCulture.cultureId),
  })

  const saveNewRegionToCulture = async (cultureId: number, name: string, shortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewRegionToCultureMutation.mutateAsync({ cultureId, regionDTO: entryDTO }).then(_ => {
      queryClient.setQueryData(["culture", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData;
        newData.subObjects?.push(entryDTO)
        return newData
      })
    })
  }

  const saveRegionToCultureMutation = useMutation({
    mutationFn: (saveDescriptionToCulture: IRemoveRegionPayload) => RegionCultureControllerService.addRegionCultureRelation(saveDescriptionToCulture.regionId, saveDescriptionToCulture.cultureId),
  })

  const saveExistingRegionToCulture = async (args: addExistingObjectToRelation): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveRegionToCultureMutation.mutateAsync({ cultureId: args.coreObjectId, regionId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["culture", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData;
        newData.subObjects?.push(entryDTO)
        return newData
      })
    })
  }

  const removeRegionFromCultureMutation = useMutation({
    mutationFn: (saveDescriptionToCulture: IRemoveRegionPayload) => RegionCultureControllerService.deleteRegionCultureRelation(saveDescriptionToCulture.regionId, saveDescriptionToCulture.cultureId),
  })

  const removeRegionFromCultureFunction = async (cultureId: number, regionId: number): Promise<void> => {
    return removeRegionFromCultureMutation.mutateAsync({ cultureId, regionId }).then(() => {
      queryClient.setQueryData(["culture", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.subObjects?.filter(region => region.id !== regionId)
        } : oldData
        return newData
      })
    })
  }

  return { saveNewRegionToCulture, saveExistingRegionToCulture, removeRegionFromCultureFunction };
}