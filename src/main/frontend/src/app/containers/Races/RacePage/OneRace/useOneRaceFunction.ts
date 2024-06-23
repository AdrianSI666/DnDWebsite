import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { EntryDTO, RaceControllerService, RaceDTO } from "../../../../../services/openapi"

interface IUpdateRaceData {
    id: number,
    raceDTO: EntryDTO
}

interface IUseOneRaceFunction {
    name: string
}

export function UseOneRaceFunction(props: IUseOneRaceFunction) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const location = useLocation();

    const removeRace = async (id: number) => {
        return RaceControllerService.deleteRace(id)
            .then((_) => {
                navigate("/races")
                queryClient.removeQueries({ queryKey: ["race", props.name] })
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editRaceMutation = useMutation({
        mutationFn: (updateRaceData: IUpdateRaceData) => RaceControllerService.updateRace(updateRaceData.id, updateRaceData.raceDTO)
    })

    async function editRace(id: number, name: string, shortDescription: string): Promise<void> {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editRaceMutation.mutateAsync({ raceDTO: entryDTO, id: id }).then(_ => {
            if (location.pathname !== "/races/" + name) {
                navigate('/races/' + name);
                queryClient.removeQueries({ queryKey: ["race", location.pathname] })
            } else {
                queryClient.setQueryData(["race", props.name], (oldData: RaceDTO) => {
                    let newData = oldData
                    newData.race = entryDTO
                    return newData
                })
            }
        })
    }

    return { removeRace, editRace };
}