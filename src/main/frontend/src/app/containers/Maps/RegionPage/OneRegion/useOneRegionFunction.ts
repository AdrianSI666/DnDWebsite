import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { EntryDTO, EntryFullDTO, RegionControllerService } from "../../../../../services/openapi"

interface IUpdateRegionData {
    id: number,
    entryFullDTO: EntryDTO
}

interface IUseOneRegionFunction {
    name: string
}

export function UseOneRegionFunction(props: IUseOneRegionFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removeRegion = async (id: number) => {
        return RegionControllerService.deleteRegion(id)
            .then((_) => {
                navigate("/regions")
                queryClient.removeQueries({ queryKey: ["region", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editRegionMutation = useMutation({
        mutationFn: (updateRegionData: IUpdateRegionData) => RegionControllerService.updateRegion(updateRegionData.id, updateRegionData.entryFullDTO)
    })

    async function editRegion(id: number, name: string, shortDescription: string): Promise<void> {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editRegionMutation.mutateAsync({ entryFullDTO: entryDTO, id: id }).then(_ => {
            if (location.pathname !== "/regions/" + name) {
                navigate('/regions/' + name);
                queryClient.removeQueries({ queryKey: ["region", location.pathname] })
            } else {
                queryClient.setQueryData(["region", props.name], (oldData: EntryFullDTO) => {
                    let newData = oldData
                    newData.object = entryDTO
                    return newData
                })
            }
        })
    }

    return { removeRegion, editRegion };
}