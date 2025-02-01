
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useJWTManager from "../../../../../services/jwt/JWTMenager"
import { EntryDTO, OpenAPI, WorldDTO, WorldPlaneControllerService } from "../../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../../components/types"

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
      queryClient.setQueryData(["world", props.name], (oldData: WorldDTO) => {
        const newData = oldData;
        //newData.subObjects?.push(res)
        return newData
      })
    })
  }

  const savePlaneToWorldMutation = useMutation({
    mutationFn: (saveDescriptionToWorld: IWorldSubObjectIdsPayload) => WorldPlaneControllerService.addWorldPlaneRelation(saveDescriptionToWorld.worldId, saveDescriptionToWorld.subObjectId),
  })

  const saveExistingPlaneToWorld = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return savePlaneToWorldMutation.mutateAsync({ worldId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["world", props.name], (oldData: WorldDTO) => {
        const newData = oldData;
        //newData.subObjects?.push(entryDTO)
        return newData
      })

    })
  }

  return {
    saveNewPlaneToWorld, saveExistingPlaneToWorld
  };
}