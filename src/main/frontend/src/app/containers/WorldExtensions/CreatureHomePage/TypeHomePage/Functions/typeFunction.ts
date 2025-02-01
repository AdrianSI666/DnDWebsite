
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useJWTManager from "../../../../../../services/jwt/JWTMenager";
import { CreatureTypeControllerService, EntryDTO, EntryFullDTO, OpenAPI, Page } from "../../../../../../services/openapi";

interface IUpdateTypeData {
    id: number,
    typeDTO: EntryDTO
}

interface ITypeFunction {
    pageNumber: number,
    pageSize: number,
    resetFullEntryDTO?: (name: string) => Promise<void>,
    worldId: number,
    worldName: string
}

export function TypeFunction(props: ITypeFunction) {
    const queryClient = useQueryClient()

    const saveTypeMutation = useMutation({
        mutationFn: (entryDTO: EntryDTO) => CreatureTypeControllerService.saveCreatureType(props.worldId, entryDTO),
    })

    async function saveType(name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveTypeMutation.mutateAsync({ name, shortDescription }).then(res => {
            let entryFullDTO: EntryFullDTO = {
                object: res,
                images: [],
                domObjects: {},
                subObjects: [],
                descriptions: []
            }
            queryClient.setQueryData(["typePageByWorldName", props.pageNumber, props.pageSize, props.worldName], (oldData: Page<EntryFullDTO>) => {
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

    const editTypeMutation = useMutation({
        mutationFn: (updateTypeData: IUpdateTypeData) => CreatureTypeControllerService.updateCreatureType(updateTypeData.id, updateTypeData.typeDTO)
    })

    async function editType(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editTypeMutation.mutateAsync({ typeDTO: entryDTO, id: id }).then(_ => {
            queryClient.setQueryData(["typePageByWorldName", props.pageNumber, props.pageSize, props.worldName],
                (oldData: Page<EntryFullDTO>) => {
                    if (props.resetFullEntryDTO) props.resetFullEntryDTO(entryDTO.name!)
                    let newData = oldData
                    newData.data = newData?.data?.map(type => {
                        if (type.object?.id === entryDTO.id) {
                            type.object = entryDTO
                        }
                        return type
                    });
                    return newData
                })
        })
    }

    const deleteTypeMutation = useMutation({
        mutationFn: CreatureTypeControllerService.deleteCreatureType,
    })

    async function deleteType(id: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteTypeMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["typePageByWorldName", props.pageNumber, props.pageSize, props.worldName] })
        })
    }

    return {
        saveType,
        editType,
        deleteType
    };
}