import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { EntryDTO, OpenAPI, SpeciesControllerService, SpeciesDTO } from "../../../../../../services/openapi"
import useJWTManager from "../../../../../../services/jwt/JWTMenager"

interface IUpdateSpeciesData {
    id: number,
    speciesDTO: EntryDTO
}

interface IUseOneSpeciesFunction {
    name: string,
    worldName: string
}

export function UseOneSpeciesFunction(props: IUseOneSpeciesFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removeSpecies = async (id: number) => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return SpeciesControllerService.deleteSpecies(id)
            .then((_) => {
                navigate("/worlds/home/" + props.worldName + "/creatures/species")
                queryClient.removeQueries({ queryKey: ["species", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
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
            if (location.pathname !== "/worlds/home/" + props.worldName + "/creatures/species/" + name) {
                navigate("/worlds/home/" + name + "/creatures/species")
                queryClient.removeQueries({ queryKey: ["species", props.name] })
            } else {
                queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
                    let newData = oldData
                    newData.species = entryDTO
                    return newData
                })
            }
        })
    }

    return { removeSpecies, editSpecies };
}