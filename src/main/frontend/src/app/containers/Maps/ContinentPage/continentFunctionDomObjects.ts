
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, PlaneControllerService, PlaneContinentControllerService, EntryFullDTO, OpenAPI } from "../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../components/types"
import useJWTManager from "../../../../services/jwt/JWTMenager"

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

    const getAllPlanes = async () => {
        return await PlaneControllerService.getAllPlanes()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

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
            queryClient.setQueryData(["continent", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.domObjects = res
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
            queryClient.setQueryData(["continent", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.domObjects = planeDTO
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
            queryClient.setQueryData(["continent", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    plane: {}
                } : oldData
                return newData
            })
        })
    }

    return { setNewPlaneToContinent, setExistingPlaneToContinent, removePlaneFromContinentFunction, getAllPlanes };
}
