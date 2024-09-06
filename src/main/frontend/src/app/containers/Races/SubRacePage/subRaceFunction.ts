
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubRaceControllerService, EntryDTO, SubRaceDTO, Page, OpenAPI } from "../../../../services/openapi";
import useJWTManager from "../../../../services/jwt/JWTMenager";

interface IUpdateSubRaceData {
    id: number,
    subRaceDTO: EntryDTO
}

interface ISubRaceFunction {
    pageNumber: number,
    pageSize: number,
    resetFullSubRaceDTO?: (name: string) => Promise<void>
}

export function SubRaceFunction(props: ISubRaceFunction) {
    const queryClient = useQueryClient()

    const saveSubRaceMutation = useMutation({
        mutationFn: SubRaceControllerService.saveSubRace,
    })

    async function saveSubRace(name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveSubRaceMutation.mutateAsync({ name, shortDescription }).then(res => {
            let subRaceDTO: SubRaceDTO = {
                subRace: res,
                images: [],
                race: {},
                regions: [],
                descriptions: []
            }
            queryClient.setQueryData(["subRacePage", props.pageNumber, props.pageSize], (oldData: Page<SubRaceDTO>) => {
                const newData = oldData;
                newData.data?.unshift(subRaceDTO)
                if(newData.data?.length! > props.pageSize) newData.data?.pop()
                return newData
            })
        })
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
            queryClient.setQueryData(["subRacePage", props.pageNumber, props.pageSize],
                (oldData: Page<SubRaceDTO>) => {
                    if (props.resetFullSubRaceDTO) props.resetFullSubRaceDTO(entryDTO.name!)
                    let newData = oldData
                    newData.data = newData?.data?.map(subRace => {
                        if (subRace.subRace?.id === entryDTO.id) {
                            subRace.subRace = entryDTO
                        }
                        return subRace
                    });
                    return newData
                })
        })
    }

    const deleteSubRaceMutation = useMutation({
        mutationFn: SubRaceControllerService.deleteSubRace,
    })

    async function deleteSubRace(id: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteSubRaceMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["subRacePage", props.pageNumber, props.pageSize] })
        })
    }

    return {
        saveSubRace,
        editSubRace,
        deleteSubRace
    };
}