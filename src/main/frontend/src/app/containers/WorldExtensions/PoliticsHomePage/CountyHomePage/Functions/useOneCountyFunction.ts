import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { EntryDTO, EntryFullDTO, CountyControllerService, OpenAPI } from "../../../../../../services/openapi"
import useJWTManager from "../../../../../../services/jwt/JWTMenager"

interface IUpdateCountyData {
    id: number,
    entryFullDTO: EntryDTO
}

interface IUseOneCountyFunction {
    name: string,
    worldName: string
}

export function UseOneCountyFunction(props: IUseOneCountyFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removeCounty = async (id: number) => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return CountyControllerService.deleteCounty(id)
            .then((_) => {
                navigate("/worlds/home/" + props.worldName +"/politics/countys")
                queryClient.removeQueries({ queryKey: ["county", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editCountyMutation = useMutation({
        mutationFn: (updateCountyData: IUpdateCountyData) => CountyControllerService.updateCounty(updateCountyData.id, updateCountyData.entryFullDTO)
    })

    async function editCounty(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editCountyMutation.mutateAsync({ entryFullDTO: entryDTO, id: id }).then(_ => {
            if (location.pathname !== "/worlds/home/" + props.worldName + "/politics/counties/" + name) {
                navigate("/worlds/home/" + props.worldName + '/politics/counties/' + name);
                queryClient.removeQueries({ queryKey: ["county", props.name] })
            } else {
                queryClient.setQueryData(["county", props.name], (oldData: EntryFullDTO) => {
                    let newData = oldData
                    newData.object = entryDTO
                    return newData
                })
            }
        })
    }

    return { removeCounty, editCounty };
}