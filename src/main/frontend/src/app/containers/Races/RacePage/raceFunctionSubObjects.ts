
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, RaceDTO, RaceSubRaceControllerService, RegionRaceControllerService } from "../../../../services/openapi"

interface IAddSubObjectPayload {
  raceId: number,
  subObjectDTO: EntryDTO
}

interface IRaceSubObjectIdsPayload {
  raceId: number,
  subObjectId: number
}

interface IRaceSubObjectsFunction {
  name: string
}

export function RaceFunctionSubObjects(props: IRaceSubObjectsFunction) {
  const queryClient = useQueryClient()

  const getAllSubRaces = async () => {
    return await RaceSubRaceControllerService.getAllSubRacesWithoutRace()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const saveNewSubRaceToRaceMutation = useMutation({
    mutationFn: (saveDescriptionToRace: IAddSubObjectPayload) => RaceSubRaceControllerService.addNewSubRaceRelation(saveDescriptionToRace.raceId, saveDescriptionToRace.subObjectDTO),
  })

  const saveNewSubRaceToRace = async (raceId: number, name: string, shortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewSubRaceToRaceMutation.mutateAsync({ raceId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["race", props.name], (oldData: RaceDTO) => {
        const newData = oldData;
        newData.subRaces?.push(res)
        return newData
      })
    })
  }

  const saveSubRaceToRaceMutation = useMutation({
    mutationFn: (saveDescriptionToRace: IRaceSubObjectIdsPayload) => RaceSubRaceControllerService.addSubRaceRelationRace(saveDescriptionToRace.raceId, saveDescriptionToRace.subObjectId),
  })

  const saveExistingSubRaceToRace = async (raceId: number, subRaceId: number, subRaceName: string, subRaceDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: subRaceName,
      shortDescription: subRaceDescription,
      id: subRaceId
    }
    return saveSubRaceToRaceMutation.mutateAsync({ raceId, subObjectId: subRaceId }).then(_ => {
      queryClient.setQueryData(["race", props.name], (oldData: RaceDTO) => {
        const newData = oldData;
        newData.subRaces?.push(entryDTO)
        return newData
      })

    })
  }

  const removeSubRaceFromRaceMutation = useMutation({
    mutationFn: (saveDescriptionToRace: IRaceSubObjectIdsPayload) => RaceSubRaceControllerService.removeSubRaceRelationRace(saveDescriptionToRace.raceId, saveDescriptionToRace.subObjectId),
  })

  const removeSubRaceFromRaceFunction = async (raceId: number, subRaceId: number): Promise<void> => {
    return removeSubRaceFromRaceMutation.mutateAsync({ raceId, subObjectId: subRaceId }).then(_ => {
      queryClient.setQueryData(["race", props.name], (oldData: RaceDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.subRaces?.filter(subRace => subRace.id !== subRaceId)
        } : oldData
        return newData
      })
    })
  }

  const saveNewRegionToRaceMutation = useMutation({
    mutationFn: (saveDescriptionToRace: IAddSubObjectPayload) => RegionRaceControllerService.addNewRegionRaceRelation(saveDescriptionToRace.raceId, saveDescriptionToRace.subObjectDTO),
  })

  const saveNewRegionToRace = async (raceId: number, name: string, shortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewRegionToRaceMutation.mutateAsync({ raceId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["race", props.name], (oldData: RaceDTO) => {
        const newData = oldData;
        newData.regions?.push(res)
        return newData
      })
    })
  }

  const saveRegionToRaceMutation = useMutation({
    mutationFn: (saveDescriptionToRace: IRaceSubObjectIdsPayload) => RegionRaceControllerService.addRegionRaceRelation(saveDescriptionToRace.subObjectId, saveDescriptionToRace.raceId),
  })

  const saveExistingRegionToRace = async (raceId: number, regionId: number, regionName: string, regionShortDescription: string): Promise<void> => {
    let entryDTO: EntryDTO = {
      name: regionName,
      shortDescription: regionShortDescription,
      id: regionId
    }
    return saveRegionToRaceMutation.mutateAsync({ raceId, subObjectId: regionId }).then(_ => {
      queryClient.setQueryData(["race", props.name], (oldData: RaceDTO) => {
        const newData = oldData;
        newData.regions?.push(entryDTO)
        return newData
      })
    })
  }

  const removeRegionFromRaceMutation = useMutation({
    mutationFn: (saveDescriptionToRace: IRaceSubObjectIdsPayload) => RegionRaceControllerService.deleteRegionRaceRelation(saveDescriptionToRace.subObjectId, saveDescriptionToRace.raceId),
  })

  const removeRegionFromRaceFunction = async (raceId: number, regionId: number): Promise<void> => {
    return removeRegionFromRaceMutation.mutateAsync({ raceId, subObjectId: regionId }).then(() => {
      queryClient.setQueryData(["race", props.name], (oldData: RaceDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.regions?.filter(region => region.id !== regionId)
        } : oldData
        return newData
      })
    })
  }

  return {
    getAllSubRaces,
    removeSubRaceFromRaceFunction, saveNewSubRaceToRace, saveExistingSubRaceToRace,
    saveNewRegionToRace, saveExistingRegionToRace, removeRegionFromRaceFunction
  };
}