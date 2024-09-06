
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { CultureControllerService, EntryDTO, EntryFullDTO, OpenAPI } from "../../../../services/openapi"
import useJWTManager from "../../../../services/jwt/JWTMenager"

interface IUpdateCultureData {
    id: number,
    cultureDTO: EntryDTO
}

interface IUseOneCultureFunction {
    name: string
}

export function UseOneCultureFunction(props: IUseOneCultureFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removeCulture = async (id: number) => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return CultureControllerService.deleteCulture(id)
            .then((_) => {
                navigate("/cultures")
                queryClient.removeQueries({ queryKey: ["culture", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editCultureMutation = useMutation({
        mutationFn: (updateCultureData: IUpdateCultureData) => CultureControllerService.updateCulture(updateCultureData.id, updateCultureData.cultureDTO)
    })

    async function editCulture(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editCultureMutation.mutateAsync({ cultureDTO: entryDTO, id: id }).then(_ => {
            if (location.pathname !== "/cultures/" + name) {
                navigate('/cultures/' + name);
                queryClient.removeQueries({ queryKey: ["culture", location.pathname] })
            } else {
                queryClient.setQueryData(["culture", props.name], (oldData: EntryFullDTO) => {
                    let newData = oldData
                    newData.object = entryDTO
                    return newData
                })
            }
        })
    }

    return { removeCulture, editCulture };
}