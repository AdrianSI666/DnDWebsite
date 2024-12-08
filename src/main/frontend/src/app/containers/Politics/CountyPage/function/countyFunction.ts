import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, EntryFullDTO, Page, CountyControllerService, OpenAPI } from "../../../../../services/openapi"
import useJWTManager from "../../../../../services/jwt/JWTMenager"

interface IUpdateCountyData {
    id: number,
    countyDTO: EntryDTO
}

interface ICountyFunction {
    pageNumber: number,
    pageSize: number,
    resetFullCountyDTO?: (name: string) => Promise<void>
}

export function CountyFunction(props: ICountyFunction) {
    const queryClient = useQueryClient()

    const saveCountyMutation = useMutation({
        mutationFn: CountyControllerService.saveCounty,
    })

    async function saveCounty(name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveCountyMutation.mutateAsync({ name, shortDescription }).then(res => {
            let countyDTO: EntryFullDTO = {
                object: res,
                images: [],
                subObjects: [],
                domObjects: {},
                descriptions: []
            }
            queryClient.setQueryData(["countyPage", props.pageNumber, props.pageSize], (oldData: Page<EntryFullDTO>) => {
                const newData = oldData;
                newData.data?.unshift(countyDTO)
                if(newData.data?.length! > props.pageSize) newData.data?.pop()
                return newData
            })
        })
    }

    const editCountyMutation = useMutation({
        mutationFn: (updateCountyData: IUpdateCountyData) => CountyControllerService.updateCounty(updateCountyData.id, updateCountyData.countyDTO)
    })

    async function editCounty(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editCountyMutation.mutateAsync({ countyDTO: entryDTO, id: id }).then(_ => {
            queryClient.setQueryData(["countyPage", props.pageNumber, props.pageSize],
                (oldData: Page<EntryFullDTO>) => {
                    if (props.resetFullCountyDTO) props.resetFullCountyDTO(entryDTO.name!)
                    let newData = oldData
                    newData.data = newData?.data?.map(county => {
                        if (county.object?.id === entryDTO.id) {
                            county.object = entryDTO
                        }
                        return county
                    });
                    return newData
                })
        })
    }

    const deleteCountyMutation = useMutation({
        mutationFn: CountyControllerService.deleteCounty,
    })

    async function deleteCounty(id: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteCountyMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["countyPage", props.pageNumber, props.pageSize] })
        })
    }

    return {
        saveCounty,
        editCounty,
        deleteCounty
    }
}