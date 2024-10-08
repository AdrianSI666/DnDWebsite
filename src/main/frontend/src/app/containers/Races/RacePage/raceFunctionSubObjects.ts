
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, OpenAPI, RaceDTO, RaceSubRaceControllerService, RegionRaceControllerService } from "../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../components/types"
import useJWTManager from "../../../../services/jwt/JWTMenager"

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
    OpenAPI.TOKEN = useJWTManager.getToken();
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

  const saveExistingSubRaceToRace = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveSubRaceToRaceMutation.mutateAsync({ raceId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
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
    OpenAPI.TOKEN = useJWTManager.getToken();
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
    OpenAPI.TOKEN = useJWTManager.getToken();
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

  const saveExistingRegionToRace = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveRegionToRaceMutation.mutateAsync({ raceId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
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
    OpenAPI.TOKEN = useJWTManager.getToken();
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