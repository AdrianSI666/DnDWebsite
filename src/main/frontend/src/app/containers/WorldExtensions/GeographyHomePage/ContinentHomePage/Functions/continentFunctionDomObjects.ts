
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useJWTManager from "../../../../../../services/jwt/JWTMenager"
import { ContinentDTO, EntryDTO, OpenAPI, PlaneContinentControllerService } from "../../../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../../../components/types"

interface IAddDomObjectPayload {
    continentId: number,
    domObjectDTO: EntryDTO
}

interface IContinentSubObjectIdsPayload {
    continentId: number,
    subObjectId: number
}

interface IContinentFunctionDomObjects {
    name: string
}

export function ContinentFunctionDomObjects(props: IContinentFunctionDomObjects) {
    const queryClient = useQueryClient()

    const setNewPlaneToContinentMutation = useMutation({
        mutationFn: (payload: IAddDomObjectPayload) =>
            PlaneContinentControllerService.addNewPlaneContinentRelation(payload.continentId, payload.domObjectDTO),
    })

    const setNewPlaneToContinent = async (continentId: number, name: string, shortDescription: string): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        setNewPlaneToContinentMutation.mutateAsync({ continentId, domObjectDTO: entryDTO }).then(res => {
            queryClient.setQueryData(["continent", props.name], (oldData: ContinentDTO) => {
                const newData = oldData;
                newData.plane = res
                return newData
            })
        })
    }

    const setPlaneToContinentMutation = useMutation({
        mutationFn: (payload: IContinentSubObjectIdsPayload) => PlaneContinentControllerService.addPlaneContinentRelation(payload.subObjectId, payload.continentId),
    })

    const setExistingPlaneToContinent = async (args: addExistingObjectToRelation): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let planeDTO: EntryDTO = {
            name: args.objectName,
            shortDescription: args.objectDescription,
            id: args.objectToAddId
        }
        return setPlaneToContinentMutation.mutateAsync({ continentId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
            queryClient.setQueryData(["continent", props.name], (oldData: ContinentDTO) => {
                const newData = oldData;
                newData.plane = planeDTO
                return newData
            })

        })
    }

    const removePlaneFromContinentMutation = useMutation({
        mutationFn: (payload: IContinentSubObjectIdsPayload) =>
            PlaneContinentControllerService.removePlaneContinentRelation(payload.subObjectId, payload.continentId),
    })

    const removePlaneFromContinentFunction = async (planeId: number, continentId: number): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return removePlaneFromContinentMutation.mutateAsync({ continentId, subObjectId: planeId }).then(_ => {
            queryClient.setQueryData(["continent", props.name], (oldData: ContinentDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    plane: {}
                } : oldData
                return newData
            })
        })
    }

    return { setNewPlaneToContinent, setExistingPlaneToContinent, removePlaneFromContinentFunction };
}
