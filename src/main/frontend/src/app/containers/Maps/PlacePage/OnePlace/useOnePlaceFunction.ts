import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { EntryDTO, EntryFullDTO, PlaceControllerService } from "../../../../../services/openapi"

interface IUpdatePlaceData {
    id: number,
    entryFullDTO: EntryDTO
}

interface IUseOnePlaceFunction {
    name: string
}

export function UseOnePlaceFunction(props: IUseOnePlaceFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removePlace = async (id: number) => {
        return PlaceControllerService.deletePlace(id)
            .then((_) => {
                navigate("/places")
                queryClient.removeQueries({ queryKey: ["place", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editPlaceMutation = useMutation({
        mutationFn: (updatePlaceData: IUpdatePlaceData) => PlaceControllerService.updatePlace(updatePlaceData.id, updatePlaceData.entryFullDTO)
    })

    async function editPlace(id: number, name: string, shortDescription: string): Promise<void> {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editPlaceMutation.mutateAsync({ entryFullDTO: entryDTO, id: id }).then(_ => {
            if (location.pathname !== "/places/" + name) {
                navigate('/places/' + name);
                queryClient.removeQueries({ queryKey: ["place", location.pathname] })
            } else {
                queryClient.setQueryData(["place", props.name], (oldData: EntryFullDTO) => {
                    let newData = oldData
                    newData.object = entryDTO
                    return newData
                })
            }
        })
    }

    return { removePlace, editPlace };
}