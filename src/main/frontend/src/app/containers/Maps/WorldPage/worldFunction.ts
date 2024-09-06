import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, EntryFullDTO, OpenAPI, Page, WorldControllerService } from "../../../../services/openapi"
import useJWTManager from "../../../../services/jwt/JWTMenager"

interface IUpdateWorldData {
    id: number,
    worldDTO: EntryDTO
}

interface IWorldFunction {
    pageNumber: number,
    pageSize: number,
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
            let worldDTO: EntryFullDTO = {
                object: res,
                images: [],
                subObjects: [],
                domObjects: {},
                descriptions: []
            }
            queryClient.setQueryData(["worldPage", props.pageNumber, props.pageSize], (oldData: Page<EntryFullDTO>) => {
                const newData = oldData;
                newData.data?.unshift(worldDTO)
                if(newData.data?.length! > props.pageSize) newData.data?.pop()
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
            queryClient.setQueryData(["worldPage", props.pageNumber, props.pageSize],
                (oldData: Page<EntryFullDTO>) => {
                    if (props.resetFullWorldDTO) props.resetFullWorldDTO(entryDTO.name!)
                    let newData = oldData
                    newData.data = newData?.data?.map(world => {
                        if (world.object?.id === entryDTO.id) {
                            world.object = entryDTO
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
            queryClient.invalidateQueries({ queryKey: ["worldPage", props.pageNumber, props.pageSize] })
        })
    }

    return {
        saveWorld,
        editWorld,
        deleteWorld
    }
}