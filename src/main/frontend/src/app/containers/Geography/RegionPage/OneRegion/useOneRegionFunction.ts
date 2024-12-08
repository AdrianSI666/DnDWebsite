import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import useJWTManager from "../../../../../services/jwt/JWTMenager"
import { EntryDTO, OpenAPI, RegionControllerService, RegionDTO } from "../../../../../services/openapi"

interface IUpdateRegionData {
    id: number,
    regionDTO: EntryDTO
}

interface IUseOneRegionFunction {
    name: string
}

export function UseOneRegionFunction(props: IUseOneRegionFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removeRegion = async (id: number) => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return RegionControllerService.deleteRegion(id)
            .then((_) => {
                navigate("/geography/regions")
                queryClient.removeQueries({ queryKey: ["region", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editRegionMutation = useMutation({
        mutationFn: (updateRegionData: IUpdateRegionData) => RegionControllerService.updateRegion(updateRegionData.id, updateRegionData.regionDTO)
    })

    async function editRegion(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let regionDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editRegionMutation.mutateAsync({ regionDTO, id: id }).then(_ => {
            if (location.pathname !== "/geography/regions/" + name) {
                navigate('/geography/regions/' + name);
                queryClient.removeQueries({ queryKey: ["region", location.pathname] })
            } else {
                queryClient.setQueryData(["region", props.name], (oldData: RegionDTO) => {
                    let newData = oldData
                    newData.region = regionDTO
                    return newData
                })
            }
        })
    }

    return { removeRegion, editRegion };
}