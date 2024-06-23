import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { EntryDTO, EntryFullDTO, ContinentControllerService } from "../../../../../services/openapi"

interface IUpdateContinentData {
    id: number,
    entryFullDTO: EntryDTO
}

interface IUseOneContinentFunction {
    name: string
}

export function UseOneContinentFunction(props: IUseOneContinentFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removeContinent = async (id: number) => {
        return ContinentControllerService.deleteContinent(id)
            .then((_) => {
                navigate("/continents")
                queryClient.removeQueries({ queryKey: ["continent", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editContinentMutation = useMutation({
        mutationFn: (updateContinentData: IUpdateContinentData) => ContinentControllerService.updateContinent(updateContinentData.id, updateContinentData.entryFullDTO)
    })

    async function editContinent(id: number, name: string, shortDescription: string): Promise<void> {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editContinentMutation.mutateAsync({ entryFullDTO: entryDTO, id: id }).then(_ => {
            if (location.pathname !== "/continents/" + name) {
                navigate('/continents/' + name);
                queryClient.removeQueries({ queryKey: ["continent", location.pathname] })
            } else {
                queryClient.setQueryData(["continent", props.name], (oldData: EntryFullDTO) => {
                    let newData = oldData
                    newData.object = entryDTO
                    return newData
                })
            }
        })
    }

    return { removeContinent, editContinent };
}