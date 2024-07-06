
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RegionControllerService, EntryDTO, RegionDTO, Page } from "../../../../../services/openapi";

interface IUpdateRegionData {
    id: number,
    regionDTO: EntryDTO
}

interface IRegionFunction {
    pageNumber: number,
    pageSize: number,
    resetFullRegionDTO?: (name: string) => Promise<void>
}

export function RegionFunction(props: IRegionFunction) {
    const queryClient = useQueryClient()

    const saveRegionMutation = useMutation({
        mutationFn: RegionControllerService.saveRegion,
    })

    async function saveRegion(name: string, shortDescription: string): Promise<void> {
        return saveRegionMutation.mutateAsync({ name, shortDescription }).then(res => {
            let regionDTO: RegionDTO = {
                region: res,
                images: [],
                kingdom: {},
                places: [],
                cultures: [],
                races: [],
                subRaces: [],
                descriptions: []
            }
            queryClient.setQueryData(["regionPage", props.pageNumber, props.pageSize], (oldData: Page<RegionDTO>) => {
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
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editRegionMutation.mutateAsync({ regionDTO: entryDTO, id: id }).then(_ => {
            queryClient.setQueryData(["regionPage", props.pageNumber, props.pageSize],
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
        return deleteRegionMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["regionPage", props.pageNumber, props.pageSize] })
        })
    }

    return {
        saveRegion,
        editRegion,
        deleteRegion
    };
}