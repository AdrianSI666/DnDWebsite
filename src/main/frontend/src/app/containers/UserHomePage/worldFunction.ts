import { useMutation, useQueryClient } from "@tanstack/react-query"
import useJWTManager from "../../../services/jwt/JWTMenager"
import { EntryDTO, OpenAPI, WorldControllerService } from "../../../services/openapi"

interface IUpdateWorldData {
    id: number,
    worldDTO: EntryDTO
}

interface IWorldFunction {
    userId?: number,
    resetFullWorldDTO?: (name: string) => Promise<void>
}

export function WorldFunction(props: IWorldFunction) {
    const queryClient = useQueryClient()

    const saveWorldMutation = useMutation({
        mutationFn: WorldControllerService.saveWorld,
    })

    async function saveWorld(name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveWorldMutation.mutateAsync({ name, shortDescription }).then(res => {
            queryClient.setQueryData(["worldAuthorId", props.userId], (oldData: Array<EntryDTO>) => {
                const newData = oldData;
                newData?.unshift(res)
                return newData
            })
        })
    }

    const editWorldMutation = useMutation({
        mutationFn: (updateWorldData: IUpdateWorldData) => WorldControllerService.updateWorld(updateWorldData.id, updateWorldData.worldDTO)
    })

    async function editWorld(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editWorldMutation.mutateAsync({ worldDTO: entryDTO, id: id }).then(_ => {
            queryClient.setQueryData(["worldAuthorId", props.userId],
                (oldData: Array<EntryDTO>) => {
                    if (props.resetFullWorldDTO) props.resetFullWorldDTO(entryDTO.name!)
                    let newData = oldData
                    newData = newData?.map(world => {
                        if (world?.id === entryDTO.id) {
                            world = entryDTO
                        }
                        return world
                    });
                    return newData
                })
        })
    }

    const deleteWorldMutation = useMutation({
        mutationFn: WorldControllerService.deleteWorld,
    })

    async function deleteWorld(id: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteWorldMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["worldAuthorId", props.userId] })
        })
    }

    return {
        saveWorld,
        editWorld,
        deleteWorld
    }
}