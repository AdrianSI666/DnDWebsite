
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CultureControllerService, EntryDTO, EntryFullDTO, OpenAPI, Page } from "../../../../../services/openapi";
import useJWTManager from "../../../../../services/jwt/JWTMenager";

interface IUpdateCultureData {
    id: number,
    cultureDTO: EntryDTO
}

interface ICultureFunction {
    pageNumber: number,
    pageSize: number,
    resetFullEntryDTO?: (name: string) => Promise<void>,
    worldId: number,
    worldName: string
}

export function CultureFunction(props: ICultureFunction) {
    const queryClient = useQueryClient()

    const saveCultureMutation = useMutation({
        mutationFn: (entryDTO: EntryDTO) => CultureControllerService.saveCulture(props.worldId, entryDTO),
    })

    async function saveCulture(name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveCultureMutation.mutateAsync({ name, shortDescription }).then(res => {
            let entryFullDTO: EntryFullDTO = {
                object: res,
                images: [],
                domObjects: {},
                subObjects: [],
                descriptions: []
            }
            queryClient.setQueryData(["culturePageByWorldName", props.pageNumber, props.pageSize, props.worldName], (oldData: Page<EntryFullDTO>) => {
                const newData = oldData;
                newData.data?.unshift(entryFullDTO)
                if (newData.data?.length! > props.pageSize) {
                    newData.data?.pop()
                    newData.totalPages!++
                }
                return newData
            })
        })
    }

    const editCultureMutation = useMutation({
        mutationFn: (updateCultureData: IUpdateCultureData) => CultureControllerService.updateCulture(updateCultureData.id, updateCultureData.cultureDTO)
    })

    async function editCulture(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editCultureMutation.mutateAsync({ cultureDTO: entryDTO, id: id }).then(_ => {
            queryClient.setQueryData(["culturePageByWorldName", props.pageNumber, props.pageSize, props.worldName],
                (oldData: Page<EntryFullDTO>) => {
                    if (props.resetFullEntryDTO) props.resetFullEntryDTO(entryDTO.name!)
                    let newData = oldData
                    newData.data = newData?.data?.map(culture => {
                        if (culture.object?.id === entryDTO.id) {
                            culture.object = entryDTO
                        }
                        return culture
                    });
                    return newData
                })
        })
    }

    const deleteCultureMutation = useMutation({
        mutationFn: CultureControllerService.deleteCulture,
    })

    async function deleteCulture(id: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteCultureMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["culturePageByWorldName", props.pageNumber, props.pageSize, props.worldName] })
        })
    }

    return {
        saveCulture,
        editCulture,
        deleteCulture
    };
}