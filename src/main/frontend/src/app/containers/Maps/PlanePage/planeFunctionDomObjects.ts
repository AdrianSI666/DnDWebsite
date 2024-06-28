
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, WorldControllerService, WorldPlaneControllerService, EntryFullDTO } from "../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../components/types"

interface IAddDomObjectPayload {
    planeId: number,
    domObjectDTO: EntryDTO
}

interface IPlaneSubObjectIdsPayload {
    planeId: number,
    subObjectId: number
}

interface IPlaneFunctionDomObjects {
    name: string
}

export function PlaneFunctionDomObjects(props: IPlaneFunctionDomObjects) {
    const queryClient = useQueryClient()

    const getAllWorlds = async () => {
        return await WorldControllerService.getAllWorlds()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const setNewWorldToPlaneMutation = useMutation({
        mutationFn: (payload: IAddDomObjectPayload) =>
            WorldPlaneControllerService.addNewWorldPlaneRelation(payload.planeId, payload.domObjectDTO),
    })

    const setNewWorldToPlane = async (planeId: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        setNewWorldToPlaneMutation.mutateAsync({ planeId, domObjectDTO: entryDTO }).then(res => {
            queryClient.setQueryData(["plane", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.domObjects = res
                return newData
            })
        })
    }

    const setWorldToPlaneMutation = useMutation({
        mutationFn: (payload: IPlaneSubObjectIdsPayload) => WorldPlaneControllerService.addWorldPlaneRelation(payload.subObjectId, payload.planeId),
    })

    const setExistingWorldToPlane = async (args: addExistingObjectToRelation): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: args.objectName,
            shortDescription: args.objectDescription,
            id: args.objectToAddId
        }
        return setWorldToPlaneMutation.mutateAsync({ planeId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
            queryClient.setQueryData(["plane", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.domObjects = entryDTO
                return newData
            })

        })
    }

    const removeWorldFromPlaneMutation = useMutation({
        mutationFn: (payload: IPlaneSubObjectIdsPayload) =>
            WorldPlaneControllerService.removeWorldPlaneRelation(payload.subObjectId, payload.planeId),
    })

    const removeWorldFromPlaneFunction = async (worldId: number, planeId: number): Promise<void> => {
        return removeWorldFromPlaneMutation.mutateAsync({ planeId, subObjectId: worldId }).then(_ => {
            queryClient.setQueryData(["plane", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    world: {}
                } : oldData
                return newData
            })
        })
    }

    return { setNewWorldToPlane, setExistingWorldToPlane, removeWorldFromPlaneFunction, getAllWorlds };
}
