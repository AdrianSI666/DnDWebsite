import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { EntryDTO, OpenAPI, SubSpeciesControllerService, SubSpeciesDTO } from "../../../../../services/openapi"
import useJWTManager from "../../../../../services/jwt/JWTMenager"

interface IUpdateSubSpeciesData {
    id: number,
    subSpeciesDTO: EntryDTO
}

interface IUseOneSubSpeciesFunction {
    name: string
}

export function UseOneSubSpeciesFunction(props: IUseOneSubSpeciesFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removeSubSpecies = async (id: number) => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return SubSpeciesControllerService.deleteSubSpecies(id)
            .then((_) => {
                navigate("/creatures/subSpecies")
                queryClient.removeQueries({ queryKey: ["subSpecies", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
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
            if (location.pathname !== "/creatures/subspecies/" + name) {
                navigate('/creatures/subspecies/' + name);
                queryClient.removeQueries({ queryKey: ["subSpecies", location.pathname] })
            } else {
                queryClient.setQueryData(["subSpecies", props.name], (oldData: SubSpeciesDTO) => {
                    let newData = oldData
                    newData.subSpecies = entryDTO
                    return newData
                })
            }
        })
    }

    return { removeSubSpecies, editSubSpecies };
}