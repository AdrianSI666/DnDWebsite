import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, EntryFullDTO, Page, ContinentControllerService } from "../../../../services/openapi"

interface IUpdateContinentData {
    id: number,
    continentDTO: EntryDTO
}

interface IContinentFunction {
    pageNumber: number,
    pageSize: number,
    resetFullContinentDTO?: (name: string) => Promise<void>
}

export function ContinentFunction(props: IContinentFunction) {
    const queryClient = useQueryClient()

    const saveContinentMutation = useMutation({
        mutationFn: ContinentControllerService.saveContinent,
    })

    async function saveContinent(name: string, shortDescription: string): Promise<void> {
        return saveContinentMutation.mutateAsync({ name, shortDescription }).then(res => {
            let continentDTO: EntryFullDTO = {
                object: res,
                images: [],
                subObjects: [],
                domObjects: {},
                descriptions: []
            }
            queryClient.setQueryData(["continentPage", props.pageNumber, props.pageSize], (oldData: Page<EntryFullDTO>) => {
                const newData = oldData;
                newData.data?.unshift(continentDTO)
                if(newData.data?.length! > props.pageSize) newData.data?.pop()
                return newData
            })
        })
    }

    const editContinentMutation = useMutation({
        mutationFn: (updateContinentData: IUpdateContinentData) => ContinentControllerService.updateContinent(updateContinentData.id, updateContinentData.continentDTO)
    })

    async function editContinent(id: number, name: string, shortDescription: string): Promise<void> {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editContinentMutation.mutateAsync({ continentDTO: entryDTO, id: id }).then(_ => {
            queryClient.setQueryData(["continentPage", props.pageNumber, props.pageSize],
                (oldData: Page<EntryFullDTO>) => {
                    if (props.resetFullContinentDTO) props.resetFullContinentDTO(entryDTO.name!)
                    let newData = oldData
                    newData.data = newData?.data?.map(continent => {
                        if (continent.object?.id === entryDTO.id) {
                            continent.object = entryDTO
                        }
                        return continent
                    });
                    return newData
                })
        })
    }

    const deleteContinentMutation = useMutation({
        mutationFn: ContinentControllerService.deleteContinent,
    })

    async function deleteContinent(id: number): Promise<void> {
        return deleteContinentMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["continentPage", props.pageNumber, props.pageSize] })
        })
    }

    return {
        saveContinent,
        editContinent,
        deleteContinent
    }
}