import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { EntryDTO, EntryFullDTO, OpenAPI, WorldControllerService } from "../../../../../services/openapi"
import useJWTManager from "../../../../../services/jwt/JWTMenager"

interface IUpdateWorldData {
    id: number,
    entryFullDTO: EntryDTO
}

interface IUseOneWorldFunction {
    name: string
}

export function UseOneWorldFunction(props: IUseOneWorldFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removeWorld = async (id: number) => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return WorldControllerService.deleteWorld(id)
            .then((_) => {
                navigate("/worlds")
                queryClient.removeQueries({ queryKey: ["world", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editWorldMutation = useMutation({
        mutationFn: (updateWorldData: IUpdateWorldData) => WorldControllerService.updateWorld(updateWorldData.id, updateWorldData.entryFullDTO)
    })

    async function editWorld(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editWorldMutation.mutateAsync({ entryFullDTO: entryDTO, id: id }).then(_ => {
            if (location.pathname !== "/worlds/" + name) {
                navigate('/worlds/' + name);
                queryClient.removeQueries({ queryKey: ["world", location.pathname] })
            } else {
                queryClient.setQueryData(["world", props.name], (oldData: EntryFullDTO) => {
                    let newData = oldData
                    newData.object = entryDTO
                    return newData
                })
            }
        })
    }

    return { removeWorld, editWorld };
}