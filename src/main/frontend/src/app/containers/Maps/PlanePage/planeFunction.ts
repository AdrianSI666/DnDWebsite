import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, EntryFullDTO, Page, PlaneControllerService } from "../../../../services/openapi"

interface IUpdatePlaneData {
    id: number,
    planeDTO: EntryDTO
}

interface IPlaneFunction {
    pageNumber: number,
    pageSize: number,
    resetFullPlaneDTO?: (name: string) => Promise<void>
}

export function PlaneFunction(props: IPlaneFunction) {
    const queryClient = useQueryClient()

    const savePlaneMutation = useMutation({
        mutationFn: PlaneControllerService.savePlane,
    })

    async function savePlane(name: string, shortDescription: string): Promise<void> {
        return savePlaneMutation.mutateAsync({ name, shortDescription }).then(res => {
            let planeDTO: EntryFullDTO = {
                object: res,
                images: [],
                subObjects: [],
                domObjects: {},
                descriptions: []
            }
            queryClient.setQueryData(["planePage", props.pageNumber, props.pageSize], (oldData: Page<EntryFullDTO>) => {
                const newData = oldData;
                newData.data?.unshift(planeDTO)
                newData.data?.pop()
                return newData
            })
        })
    }

    const editPlaneMutation = useMutation({
        mutationFn: (updatePlaneData: IUpdatePlaneData) => PlaneControllerService.updatePlane(updatePlaneData.id, updatePlaneData.planeDTO)
    })

    async function editPlane(id: number, name: string, shortDescription: string): Promise<void> {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editPlaneMutation.mutateAsync({ planeDTO: entryDTO, id: id }).then(_ => {
            queryClient.setQueryData(["planePage", props.pageNumber, props.pageSize],
                (oldData: Page<EntryFullDTO>) => {
                    if (props.resetFullPlaneDTO) props.resetFullPlaneDTO(entryDTO.name!)
                    let newData = oldData
                    newData.data = newData?.data?.map(plane => {
                        if (plane.object?.id === entryDTO.id) {
                            plane.object = entryDTO
                        }
                        return plane
                    });
                    return newData
                })
        })
    }

    const deletePlaneMutation = useMutation({
        mutationFn: PlaneControllerService.deletePlane,
    })

    async function deletePlane(id: number): Promise<void> {
        return deletePlaneMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["planePage", props.pageNumber, props.pageSize] })
        })
    }

    return {
        savePlane,
        editPlane,
        deletePlane
    }
}