
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, EntryFullDTO, OpenAPI, WorldPlaneControllerService } from "../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../components/types"
import useJWTManager from "../../../../services/jwt/JWTMenager"

interface IAddSubObjectPayload {
  worldId: number,
  subObjectDTO: EntryDTO
}

interface IWorldSubObjectIdsPayload {
  worldId: number,
  subObjectId: number
}

interface IWorldFunctionSubObjects {
  name: string
}

export function WorldFunctionSubObjects(props: IWorldFunctionSubObjects) {
  const queryClient = useQueryClient()

  const getAllPlanesWithoutWorld = async () => {
    return await WorldPlaneControllerService.getAllPlanesWithoutWorld()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const saveNewPlaneToWorldMutation = useMutation({
    mutationFn: (saveDescriptionToWorld: IAddSubObjectPayload) => WorldPlaneControllerService.addNewPlaneWorldRelation(saveDescriptionToWorld.worldId, saveDescriptionToWorld.subObjectDTO),
  })

  const saveNewPlaneToWorld = async (worldId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewPlaneToWorldMutation.mutateAsync({ worldId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["world", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData;
        newData.subObjects?.push(res)
        return newData
      })
    })
  }

  const savePlaneToWorldMutation = useMutation({
    mutationFn: (saveDescriptionToWorld: IWorldSubObjectIdsPayload) => WorldPlaneControllerService.addWorldPlaneRelation(saveDescriptionToWorld.worldId, saveDescriptionToWorld.subObjectId),
  })

  const saveExistingPlaneToWorld = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return savePlaneToWorldMutation.mutateAsync({ worldId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["world", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData;
        newData.subObjects?.push(entryDTO)
        return newData
      })

    })
  }

  const removePlaneFromWorldMutation = useMutation({
    mutationFn: (saveDescriptionToWorld: IWorldSubObjectIdsPayload) => WorldPlaneControllerService.removeWorldPlaneRelation(saveDescriptionToWorld.worldId, saveDescriptionToWorld.subObjectId),
  })

  const removePlaneFromWorldFunction = async (worldId: number, planeId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removePlaneFromWorldMutation.mutateAsync({ worldId, subObjectId: planeId }).then(_ => {
      queryClient.setQueryData(["world", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.subObjects?.filter(plane => plane.id !== planeId)
        } : oldData
        return newData
      })
    })
  }

  return {
    getAllPlanesWithoutWorld,
    removePlaneFromWorldFunction, saveNewPlaneToWorld, saveExistingPlaneToWorld
  };
}