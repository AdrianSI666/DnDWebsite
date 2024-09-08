import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { EntryDTO, EntryFullDTO, OpenAPI, PlaneControllerService } from "../../../../../services/openapi"
import useJWTManager from "../../../../../services/jwt/JWTMenager"

interface IUpdatePlaneData {
    id: number,
    entryFullDTO: EntryDTO
}

interface IUseOnePlaneFunction {
    name: string
}

export function UseOnePlaneFunction(props: IUseOnePlaneFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removePlane = async (id: number) => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return PlaneControllerService.deletePlane(id)
            .then((_) => {
                navigate("/planes")
                queryClient.removeQueries({ queryKey: ["plane", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editPlaneMutation = useMutation({
        mutationFn: (updatePlaneData: IUpdatePlaneData) => PlaneControllerService.updatePlane(updatePlaneData.id, updatePlaneData.entryFullDTO)
    })

    async function editPlane(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editPlaneMutation.mutateAsync({ entryFullDTO: entryDTO, id: id }).then(_ => {
            if (location.pathname !== "/planes/" + name) {
                navigate('/planes/' + name);
                queryClient.removeQueries({ queryKey: ["plane", location.pathname] })
            } else {
                queryClient.setQueryData(["plane", props.name], (oldData: EntryFullDTO) => {
                    let newData = oldData
                    newData.object = entryDTO
                    return newData
                })
            }
        })
    }

    return { removePlane, editPlane };
}