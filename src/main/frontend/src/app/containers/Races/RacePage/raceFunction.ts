
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RaceControllerService, EntryDTO, RaceDTO, Page, OpenAPI } from "../../../../services/openapi";
import useJWTManager from "../../../../services/jwt/JWTMenager";

interface IUpdateRaceData {
    id: number,
    raceDTO: EntryDTO
}

interface IRaceFunction {
    pageNumber: number,
    pageSize: number,
    resetFullRaceDTO?: (name: string) => Promise<void>
}

export function RaceFunction(props: IRaceFunction) {
    const queryClient = useQueryClient()

    const saveRaceMutation = useMutation({
        mutationFn: RaceControllerService.saveRace,
    })

    async function saveRace(name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveRaceMutation.mutateAsync({ name, shortDescription }).then(res => {
            let raceDTO: RaceDTO = {
                race: res,
                images: [],
                subRaces: [],
                regions: [],
                descriptions: []
            }
            queryClient.setQueryData(["racePage", props.pageNumber, props.pageSize], (oldData: Page<RaceDTO>) => {
                const newData = oldData;
                newData.data?.unshift(raceDTO)
                if(newData.data?.length! > props.pageSize) newData.data?.pop()
                return newData
            })
        })
    }

    const editRaceMutation = useMutation({
        mutationFn: (updateRaceData: IUpdateRaceData) => RaceControllerService.updateRace(updateRaceData.id, updateRaceData.raceDTO)
    })

    async function editRace(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editRaceMutation.mutateAsync({ raceDTO: entryDTO, id: id }).then(_ => {
            queryClient.setQueryData(["racePage", props.pageNumber, props.pageSize],
                (oldData: Page<RaceDTO>) => {
                    if(props.resetFullRaceDTO)props.resetFullRaceDTO(entryDTO.name!)
                    let newData = oldData
                    newData.data = newData?.data?.map(race => {
                        if (race.race?.id === entryDTO.id) {
                            race.race = entryDTO
                        }
                        return race
                    });
                    return newData
                })
        })
    }

    const deleteRaceMutation = useMutation({
        mutationFn: RaceControllerService.deleteRace,
    })

    async function deleteRace(id: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteRaceMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["racePage", props.pageNumber, props.pageSize] })
        })
    }

    return {
        saveRace,
        editRace,
        deleteRace
    };
}