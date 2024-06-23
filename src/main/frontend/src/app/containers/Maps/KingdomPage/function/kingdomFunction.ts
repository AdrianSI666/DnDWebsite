import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, EntryFullDTO, Page, KingdomControllerService } from "../../../../../services/openapi"

interface IUpdateKingdomData {
    id: number,
    kingdomDTO: EntryDTO
}

interface IKingdomFunction {
    pageNumber: number,
    pageSize: number,
    resetFullKingdomDTO?: (name: string) => Promise<void>
}

export function KingdomFunction(props: IKingdomFunction) {
    const queryClient = useQueryClient()

    const saveKingdomMutation = useMutation({
        mutationFn: KingdomControllerService.saveKingdom,
    })

    async function saveKingdom(name: string, shortDescription: string): Promise<void> {
        return saveKingdomMutation.mutateAsync({ name, shortDescription }).then(res => {
            let kingdomDTO: EntryFullDTO = {
                object: res,
                images: [],
                subObjects: [],
                domObjects: {},
                descriptions: []
            }
            queryClient.setQueryData(["kingdomPage", props.pageNumber, props.pageSize], (oldData: Page<EntryFullDTO>) => {
                const newData = oldData;
                newData.data?.unshift(kingdomDTO)
                newData.data?.pop()
                return newData
            })
        })
    }

    const editKingdomMutation = useMutation({
        mutationFn: (updateKingdomData: IUpdateKingdomData) => KingdomControllerService.updateKingdom(updateKingdomData.id, updateKingdomData.kingdomDTO)
    })

    async function editKingdom(id: number, name: string, shortDescription: string): Promise<void> {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editKingdomMutation.mutateAsync({ kingdomDTO: entryDTO, id: id }).then(_ => {
            queryClient.setQueryData(["kingdomPage", props.pageNumber, props.pageSize],
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
        return deleteKingdomMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["kingdomPage", props.pageNumber, props.pageSize] })
        })
    }

    return {
        saveKingdom,
        editKingdom,
        deleteKingdom
    }
}