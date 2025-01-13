
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import useJWTManager from "../../../../../../services/jwt/JWTMenager"
import { EntryDTO, OpenAPI, CreatureTypeDTO, CreatureTypeControllerService } from "../../../../../../services/openapi"

interface IUpdateTypeData {
    id: number,
    typeDTO: EntryDTO
}

interface IUseOneTypeFunction {
    name: string,
    worldName: string,
}

export function UseOneTypeFunction(props: IUseOneTypeFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removeType = async (id: number) => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return CreatureTypeControllerService.deleteCreatureType(id)
            .then((_) => {
                navigate("/worlds/home/" + props.worldName + "/creatures/types")
                queryClient.removeQueries({ queryKey: ["creatureType", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
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
            if (location.pathname !== "/worlds/home/" + props.worldName + "/creatures/types/" + name) {
                navigate("/worlds/home/" + props.worldName + '/creatures/types/' + name);
                queryClient.removeQueries({ queryKey: ["creatureType", props.name] })
            } else {
                queryClient.setQueryData(["type", props.name], (oldData: CreatureTypeDTO) => {
                    let newData = oldData
                    newData.creatureType = entryDTO
                    return newData
                })
            }
        })
    }

    return { removeType, editType };
}