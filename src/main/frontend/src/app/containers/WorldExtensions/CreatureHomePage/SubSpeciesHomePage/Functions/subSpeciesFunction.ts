
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubSpeciesControllerService, EntryDTO, SubSpeciesDTO, Page, OpenAPI } from "../../../../../../services/openapi";
import useJWTManager from "../../../../../../services/jwt/JWTMenager";

interface IUpdateSubSpeciesData {
    id: number,
    subSpeciesDTO: EntryDTO
}

interface ISubSpeciesFunction {
    pageNumber: number,
    pageSize: number,
    resetFullSubSpeciesDTO?: (name: string) => Promise<void>,
    worldId: number,
    worldName: string
}

export function SubSpeciesFunction(props: ISubSpeciesFunction) {
    const queryClient = useQueryClient()

    const saveSubSpeciesMutation = useMutation({
        mutationFn: (entryDTO: EntryDTO) => SubSpeciesControllerService.saveSubSpecies(props.worldId, entryDTO),
    })

    async function saveSubSpecies(name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveSubSpeciesMutation.mutateAsync({ name, shortDescription }).then(res => {
            let subSpeciesDTO: SubSpeciesDTO = {
                subSpecies: res,
                images: [],
                species: {},
                regions: [],
                descriptions: []
            }
            queryClient.setQueryData(["subSpeciesPageByWorldName", props.pageNumber, props.pageSize, props.worldName], (oldData: Page<SubSpeciesDTO>) => {
                const newData = oldData;
                newData.data?.unshift(subSpeciesDTO)
                if(newData.data?.length! > props.pageSize) newData.data?.pop()
                return newData
            })
        })
    }

    const editSubSpeciesMutation = useMutation({
        mutationFn: (updateSubSpeciesData: IUpdateSubSpeciesData) => SubSpeciesControllerService.updateSubSpecies(updateSubSpeciesData.id, updateSubSpeciesData.subSpeciesDTO)
    })

    async function editSubSpecies(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editSubSpeciesMutation.mutateAsync({ subSpeciesDTO: entryDTO, id: id }).then(_ => {
            queryClient.setQueryData(["subSpeciesPageByWorldName", props.pageNumber, props.pageSize, props.worldName],
                (oldData: Page<SubSpeciesDTO>) => {
                    if (props.resetFullSubSpeciesDTO) props.resetFullSubSpeciesDTO(entryDTO.name!)
                    let newData = oldData
                    newData.data = newData?.data?.map(subSpecies => {
                        if (subSpecies.subSpecies?.id === entryDTO.id) {
                            subSpecies.subSpecies = entryDTO
                        }
                        return subSpecies
                    });
                    return newData
                })
        })
    }

    const deleteSubSpeciesMutation = useMutation({
        mutationFn: SubSpeciesControllerService.deleteSubSpecies,
    })

    async function deleteSubSpecies(id: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteSubSpeciesMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["subSpeciesPageByWorldName", props.pageNumber, props.pageSize, props.worldName] })
        })
    }

    return {
        saveSubSpecies,
        editSubSpecies,
        deleteSubSpecies
    };
}