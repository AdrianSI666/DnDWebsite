
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SpeciesControllerService, EntryDTO, SpeciesDTO, Page, OpenAPI } from "../../../../services/openapi";
import useJWTManager from "../../../../services/jwt/JWTMenager";

interface IUpdateSpeciesData {
    id: number,
    speciesDTO: EntryDTO
}

interface ISpeciesFunction {
    pageNumber: number,
    pageSize: number,
    resetFullSpeciesDTO?: (name: string) => Promise<void>,
    worldId: number,
    worldName: string
}

export function SpeciesFunction(props: ISpeciesFunction) {
    const queryClient = useQueryClient()

    const saveSpeciesMutation = useMutation({
        mutationFn: (entryDTO: EntryDTO) => SpeciesControllerService.saveSpecies(props.worldId, entryDTO),
    })

    async function saveSpecies(name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveSpeciesMutation.mutateAsync({ name, shortDescription }).then(res => {
            let speciesDTO: SpeciesDTO = {
                species: res,
                images: [],
                subSpecies: [],
                regions: [],
                descriptions: []
            }
            queryClient.setQueryData(["speciePageByWorldName", props.pageNumber, props.pageSize, props.worldName], (oldData: Page<SpeciesDTO>) => {
                const newData = oldData;
                newData.data?.unshift(speciesDTO)
                if(newData.data?.length! > props.pageSize) newData.data?.pop()
                return newData
            })
        })
    }

    const editSpeciesMutation = useMutation({
        mutationFn: (updateSpeciesData: IUpdateSpeciesData) => SpeciesControllerService.updateSpecies(updateSpeciesData.id, updateSpeciesData.speciesDTO)
    })

    async function editSpecies(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editSpeciesMutation.mutateAsync({ speciesDTO: entryDTO, id: id }).then(_ => {
            queryClient.setQueryData(["speciePageByWorldName", props.pageNumber, props.pageSize, props.worldName],
                (oldData: Page<SpeciesDTO>) => {
                    if(props.resetFullSpeciesDTO)props.resetFullSpeciesDTO(entryDTO.name!)
                    let newData = oldData
                    newData.data = newData?.data?.map(species => {
                        if (species.species?.id === entryDTO.id) {
                            species.species = entryDTO
                        }
                        return species
                    });
                    return newData
                })
        })
    }

    const deleteSpeciesMutation = useMutation({
        mutationFn: SpeciesControllerService.deleteSpecies,
    })

    async function deleteSpecies(id: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteSpeciesMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["speciePageByWorldName", props.pageNumber, props.pageSize, props.worldName] })
        })
    }

    return {
        saveSpecies,
        editSpecies,
        deleteSpecies
    };
}