import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { EntryDTO, OpenAPI, SubRaceControllerService, SubRaceDTO } from "../../../../../services/openapi"
import useJWTManager from "../../../../../services/jwt/JWTMenager"

interface IUpdateSubRaceData {
    id: number,
    subRaceDTO: EntryDTO
}

interface IUseOneSubRaceFunction {
    name: string
}

export function UseOneSubRaceFunction(props: IUseOneSubRaceFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removeSubRace = async (id: number) => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return SubRaceControllerService.deleteSubRace(id)
            .then((_) => {
                navigate("/subRaces")
                queryClient.removeQueries({ queryKey: ["subRace", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editSubRaceMutation = useMutation({
        mutationFn: (updateSubRaceData: IUpdateSubRaceData) => SubRaceControllerService.updateSubRace(updateSubRaceData.id, updateSubRaceData.subRaceDTO)
    })

    async function editSubRace(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editSubRaceMutation.mutateAsync({ subRaceDTO: entryDTO, id: id }).then(_ => {
            if (location.pathname !== "/subRaces/" + name) {
                navigate('/subRaces/' + name);
                queryClient.removeQueries({ queryKey: ["subRace", location.pathname] })
            } else {
                queryClient.setQueryData(["subRace", props.name], (oldData: SubRaceDTO) => {
                    let newData = oldData
                    newData.subRace = entryDTO
                    return newData
                })
            }
        })
    }

    return { removeSubRace, editSubRace };
}