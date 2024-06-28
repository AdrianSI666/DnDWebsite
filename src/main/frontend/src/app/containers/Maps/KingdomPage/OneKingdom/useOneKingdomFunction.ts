import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { EntryDTO, EntryFullDTO, KingdomControllerService } from "../../../../../services/openapi"

interface IUpdateKingdomData {
    id: number,
    entryFullDTO: EntryDTO
}

interface IUseOneKingdomFunction {
    name: string
}

export function UseOneKingdomFunction(props: IUseOneKingdomFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removeKingdom = async (id: number) => {
        return KingdomControllerService.deleteKingdom(id)
            .then((_) => {
                navigate("/kingdoms")
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
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editKingdomMutation.mutateAsync({ entryFullDTO: entryDTO, id: id }).then(_ => {
            if (location.pathname !== "/kingdoms/" + name) {
                navigate('/kingdoms/' + name);
                queryClient.removeQueries({ queryKey: ["kingdom", location.pathname] })
            } else {
                queryClient.setQueryData(["kingdom", props.name], (oldData: EntryFullDTO) => {
                    let newData = oldData
                    newData.object = entryDTO
                    return newData
                })
            }
        })
    }

    return { removeKingdom, editKingdom };
}