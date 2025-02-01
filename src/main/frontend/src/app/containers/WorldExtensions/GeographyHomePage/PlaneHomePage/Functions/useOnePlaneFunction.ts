import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { EntryDTO, OpenAPI, PlaneControllerService, PlaneFullDTO } from "../../../../../../services/openapi"
import useJWTManager from "../../../../../../services/jwt/JWTMenager"

interface IUpdatePlaneData {
    id: number,
    planeDTO: EntryDTO
}

interface IUseOnePlaneFunction {
    name: string,
    worldName: string
}

export function UseOnePlaneFunction(props: IUseOnePlaneFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removePlane = async (id: number) => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return PlaneControllerService.deletePlane(id)
            .then((_) => {
                navigate("/worlds/home/" + props.worldName + "/geography/planes")
                queryClient.removeQueries({ queryKey: ["plane", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editPlaneMutation = useMutation({
        mutationFn: (updatePlaneData: IUpdatePlaneData) => PlaneControllerService.updatePlane(updatePlaneData.id, updatePlaneData.planeDTO)
    })

    async function editPlane(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let planeDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editPlaneMutation.mutateAsync({ planeDTO, id: id }).then(_ => {
            if (location.pathname !== "/worlds/home/" + props.worldName + "/geography/planes/" + name) {
                navigate("/worlds/home/" + props.worldName + '/geography/planes/' + name);
                queryClient.removeQueries({ queryKey: ["plane", props.name] })
            } else {
                queryClient.setQueryData(["plane", props.name], (oldData: PlaneFullDTO) => {
                    let newData = oldData
                    newData.plane = planeDTO
                    return newData
                })
            }
        })
    }

    return { removePlane, editPlane };
}