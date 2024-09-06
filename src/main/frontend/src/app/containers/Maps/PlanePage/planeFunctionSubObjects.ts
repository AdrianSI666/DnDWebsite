
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, EntryFullDTO, OpenAPI, PlaneContinentControllerService } from "../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../components/types"
import useJWTManager from "../../../../services/jwt/JWTMenager"

interface IAddSubObjectPayload {
  planeId: number,
  subObjectDTO: EntryDTO
}

interface IPlaneSubObjectIdsPayload {
  planeId: number,
  subObjectId: number
}

interface IPlaneFunctionSubObjects {
  name: string
}

export function PlaneFunctionSubObjects(props: IPlaneFunctionSubObjects) {
  const queryClient = useQueryClient()

  const getAllContinentsWithoutPlane = async () => {
    return await PlaneContinentControllerService.getAllContinentsWithoutPlane()
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const saveNewContinentToPlaneMutation = useMutation({
    mutationFn: (saveDescriptionToPlane: IAddSubObjectPayload) => PlaneContinentControllerService.addNewContinentPlaneRelation(saveDescriptionToPlane.planeId, saveDescriptionToPlane.subObjectDTO),
  })

  const saveNewContinentToPlane = async (planeId: number, name: string, shortDescription: string): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: name,
      shortDescription: shortDescription
    }
    return saveNewContinentToPlaneMutation.mutateAsync({ planeId, subObjectDTO: entryDTO }).then(res => {
      queryClient.setQueryData(["plane", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData;
        newData.subObjects?.push(res)
        return newData
      })
    })
  }

  const saveContinentToPlaneMutation = useMutation({
    mutationFn: (saveDescriptionToPlane: IPlaneSubObjectIdsPayload) => PlaneContinentControllerService.addPlaneContinentRelation(saveDescriptionToPlane.planeId, saveDescriptionToPlane.subObjectId),
  })

  const saveExistingContinentToPlane = async (args: addExistingObjectToRelation): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    let entryDTO: EntryDTO = {
      name: args.objectName,
      shortDescription: args.objectDescription,
      id: args.objectToAddId
    }
    return saveContinentToPlaneMutation.mutateAsync({ planeId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
      queryClient.setQueryData(["plane", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData;
        newData.subObjects?.push(entryDTO)
        return newData
      })
    })
  }

  const removeContinentFromPlaneMutation = useMutation({
    mutationFn: (saveDescriptionToPlane: IPlaneSubObjectIdsPayload) => PlaneContinentControllerService.removePlaneContinentRelation(saveDescriptionToPlane.planeId, saveDescriptionToPlane.subObjectId),
  })

  const removeContinentFromPlaneFunction = async (planeId: number, continentId: number): Promise<void> => {
    OpenAPI.TOKEN = useJWTManager.getToken();
    return removeContinentFromPlaneMutation.mutateAsync({ planeId, subObjectId: continentId }).then(_ => {
      queryClient.setQueryData(["plane", props.name], (oldData: EntryFullDTO) => {
        const newData = oldData ? {
          ...oldData,
          subObjects: oldData.subObjects?.filter(continent => continent.id !== continentId)
        } : oldData
        return newData
      })
    })
  }

  return {
    getAllContinentsWithoutPlane,
    removeContinentFromPlaneFunction, saveNewContinentToPlane, saveExistingContinentToPlane
  };
}