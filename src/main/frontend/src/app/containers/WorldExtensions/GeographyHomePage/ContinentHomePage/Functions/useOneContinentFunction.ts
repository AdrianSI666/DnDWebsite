import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import useJWTManager from "../../../../../../services/jwt/JWTMenager"
import { EntryDTO, OpenAPI, ContinentControllerService, ContinentDTO } from "../../../../../../services/openapi"

interface IUpdateContinentData {
    id: number,
    continentDTO: EntryDTO
}

interface IUseOneContinentFunction {
    name: string,
    worldName: string
}

export function UseOneContinentFunction(props: IUseOneContinentFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removeContinent = async (id: number) => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return ContinentControllerService.deleteContinent(id)
            .then((_) => {
                navigate("/worlds/home/" + props.worldName + "/geography/continents")
                queryClient.removeQueries({ queryKey: ["continent", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editContinentMutation = useMutation({
        mutationFn: (updateContinentData: IUpdateContinentData) => ContinentControllerService.updateContinent(updateContinentData.id, updateContinentData.continentDTO)
    })

    async function editContinent(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editContinentMutation.mutateAsync({ continentDTO: entryDTO, id: id }).then(_ => {
            if (location.pathname !== "/worlds/home/" + props.worldName + "/geography/continents/" + name) {
                navigate("/worlds/home/" + props.worldName + '/geography/continents/' + name);
                queryClient.removeQueries({ queryKey: ["continent", props.name] })
            } else {
                queryClient.setQueryData(["continent", props.name], (oldData: ContinentDTO) => {
                    let newData = oldData
                    newData.continent = entryDTO
                    return newData
                })
            }
        })
    }

    return { removeContinent, editContinent };
}