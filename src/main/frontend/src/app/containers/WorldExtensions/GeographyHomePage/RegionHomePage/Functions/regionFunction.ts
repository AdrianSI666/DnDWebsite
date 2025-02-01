
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RegionControllerService, EntryDTO, RegionDTO, Page, OpenAPI } from "../../../../../../services/openapi";
import useJWTManager from "../../../../../../services/jwt/JWTMenager";

interface IUpdateRegionData {
    id: number,
    regionDTO: EntryDTO
}

interface IRegionFunction {
    pageNumber: number,
    pageSize: number,
    resetFullRegionDTO?: (name: string) => Promise<void>,
    worldId: number,
    worldName: string
}

export function RegionFunction(props: IRegionFunction) {
    const queryClient = useQueryClient()

    const saveRegionMutation = useMutation({
        mutationFn: (entryDTO: EntryDTO) => RegionControllerService.saveRegion(props.worldId, entryDTO),
    })

    async function saveRegion(name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveRegionMutation.mutateAsync({ name, shortDescription }).then(res => {
            let regionDTO: RegionDTO = {
                region: res,
                images: [],
                descriptions: [],
                continent: {},
                places: [],
                cultures: [],
                species: [],
                subSpecies: [],
                counties: []
            }
            queryClient.setQueryData(["regionPageByWorldName", props.pageNumber, props.pageSize, props.worldName], (oldData: Page<RegionDTO>) => {
                const newData = oldData;
                newData.data?.unshift(regionDTO)
                if(newData.data?.length! > props.pageSize) newData.data?.pop()
                return newData
            })
        })
    }

    const editRegionMutation = useMutation({
        mutationFn: (updateRegionData: IUpdateRegionData) => RegionControllerService.updateRegion(updateRegionData.id, updateRegionData.regionDTO)
    })

    async function editRegion(id: number, name: string, shortDescription: string): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editRegionMutation.mutateAsync({ regionDTO: entryDTO, id: id }).then(_ => {
            queryClient.setQueryData(["regionPageByWorldName", props.pageNumber, props.pageSize, props.worldName],
                (oldData: Page<RegionDTO>) => {
                    if (props.resetFullRegionDTO) props.resetFullRegionDTO(entryDTO.name!)
                    let newData = oldData
                    newData.data = newData?.data?.map(region => {
                        if (region.region?.id === entryDTO.id) {
                            region.region = entryDTO
                        }
                        return region
                    });
                    return newData
                })
        })
    }

    const deleteRegionMutation = useMutation({
        mutationFn: RegionControllerService.deleteRegion,
    })

    async function deleteRegion(id: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteRegionMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["regionPageByWorldName", props.pageNumber, props.pageSize, props.worldName] })
        })
    }

    return {
        saveRegion,
        editRegion,
        deleteRegion
    };
}