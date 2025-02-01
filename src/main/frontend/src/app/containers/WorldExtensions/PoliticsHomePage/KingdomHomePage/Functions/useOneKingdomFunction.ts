import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import useJWTManager from "../../../../../../services/jwt/JWTMenager"
import { EntryDTO, KingdomControllerService, KingdomDTO, OpenAPI } from "../../../../../../services/openapi"

interface IUpdateKingdomData {
    id: number,
    entryFullDTO: EntryDTO
}

interface IUseOneKingdomFunction {
    name: string,
    worldName: string,
}

export function UseOneKingdomFunction(props: IUseOneKingdomFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removeKingdom = async (id: number) => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return KingdomControllerService.deleteKingdom(id)
            .then((_) => {
                navigate("/worlds/home/" + props.worldName + "/policitcs/kingdoms")
                queryClient.removeQueries({ queryKey: ["kingdom", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editKingdomMutation = useMutation({
        mutationFn: (updateKingdomData: IUpdateKingdomData) => KingdomControllerService.updateKingdom(updateKingdomData.id, updateKingdomData.entryFullDTO)
    })

    async function editKingdom(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editKingdomMutation.mutateAsync({ entryFullDTO: entryDTO, id: id }).then(_ => {
            if (location.pathname !== "/worlds/home/" + props.worldName + "/politics/kingdoms/" + name) {
                navigate("/worlds/home/" + props.worldName + '/politics/kingdoms/' + name);
                queryClient.removeQueries({ queryKey: ["kingdom", props.name] })
            } else {
                queryClient.setQueryData(["kingdom", props.name], (oldData: KingdomDTO) => {
                    let newData = oldData
                    newData.object = entryDTO
                    return newData
                })
            }
        })
    }

    return { removeKingdom, editKingdom };
}