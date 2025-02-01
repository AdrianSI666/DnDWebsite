import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, EntryFullDTO, Page, KingdomControllerService, OpenAPI } from "../../../../../../services/openapi"
import useJWTManager from "../../../../../../services/jwt/JWTMenager"

interface IUpdateKingdomData {
    id: number,
    kingdomDTO: EntryDTO
}

interface IKingdomFunction {
    pageNumber: number,
    pageSize: number,
    resetFullKingdomDTO?: (name: string) => Promise<void>,
    worldId: number,
    worldName: string
}

export function KingdomFunction(props: IKingdomFunction) {
    const queryClient = useQueryClient()

    const saveKingdomMutation = useMutation({
        mutationFn: (entryDTO: EntryDTO) => KingdomControllerService.saveKingdom(props.worldId, entryDTO),
    })

    async function saveKingdom(name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveKingdomMutation.mutateAsync({ name, shortDescription }).then(res => {
            let kingdomDTO: EntryFullDTO = {
                object: res,
                images: [],
                subObjects: [],
                domObjects: {},
                descriptions: []
            }
            queryClient.setQueryData(["kingdomPageByWorldName", props.pageNumber, props.pageSize, props.worldName], (oldData: Page<EntryFullDTO>) => {
                const newData = oldData;
                newData.data?.unshift(kingdomDTO)
                if(newData.data?.length! > props.pageSize) newData.data?.pop()
                return newData
            })
        })
    }

    const editKingdomMutation = useMutation({
        mutationFn: (updateKingdomData: IUpdateKingdomData) => KingdomControllerService.updateKingdom(updateKingdomData.id, updateKingdomData.kingdomDTO)
    })

    async function editKingdom(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editKingdomMutation.mutateAsync({ kingdomDTO: entryDTO, id: id }).then(_ => {
            queryClient.setQueryData(["kingdomPageByWorldName", props.pageNumber, props.pageSize, props.worldName],
                (oldData: Page<EntryFullDTO>) => {
                    if (props.resetFullKingdomDTO) props.resetFullKingdomDTO(entryDTO.name!)
                    let newData = oldData
                    newData.data = newData?.data?.map(kingdom => {
                        if (kingdom.object?.id === entryDTO.id) {
                            kingdom.object = entryDTO
                        }
                        return kingdom
                    });
                    return newData
                })
        })
    }

    const deleteKingdomMutation = useMutation({
        mutationFn: KingdomControllerService.deleteKingdom,
    })

    async function deleteKingdom(id: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteKingdomMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["kingdomPageByWorldName", props.pageNumber, props.pageSize, props.worldName] })
        })
    }

    return {
        saveKingdom,
        editKingdom,
        deleteKingdom
    }
}