import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, EntryFullDTO, Page, PlaceControllerService } from "../../../../../services/openapi"

interface IUpdatePlaceData {
    id: number,
    placeDTO: EntryDTO
}

interface IPlaceFunction {
    pageNumber: number,
    pageSize: number,
    resetFullPlaceDTO?: (name: string) => Promise<void>
}

export function PlaceFunction(props: IPlaceFunction) {
    const queryClient = useQueryClient()

    const savePlaceMutation = useMutation({
        mutationFn: PlaceControllerService.savePlace,
    })

    async function savePlace(name: string, shortDescription: string): Promise<void> {
        return savePlaceMutation.mutateAsync({ name, shortDescription }).then(res => {
            let placeDTO: EntryFullDTO = {
                object: res,
                images: [],
                subObjects: [],
                domObjects: {},
                descriptions: []
            }
            queryClient.setQueryData(["placePage", props.pageNumber, props.pageSize], (oldData: Page<EntryFullDTO>) => {
                const newData = oldData;
                newData.data?.unshift(placeDTO)
                if(newData.data?.length! > props.pageSize) newData.data?.pop()
                return newData
            })
        })
    }

    const editPlaceMutation = useMutation({
        mutationFn: (updatePlaceData: IUpdatePlaceData) => PlaceControllerService.updatePlace(updatePlaceData.id, updatePlaceData.placeDTO)
    })

    async function editPlace(id: number, name: string, shortDescription: string): Promise<void> {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            shortDescription: shortDescription
        }
        return editPlaceMutation.mutateAsync({ placeDTO: entryDTO, id: id }).then(_ => {
            queryClient.setQueryData(["placePage", props.pageNumber, props.pageSize],
                (oldData: Page<EntryFullDTO>) => {
                    if (props.resetFullPlaceDTO) props.resetFullPlaceDTO(entryDTO.name!)
                    let newData = oldData
                    newData.data = newData?.data?.map(place => {
                        if (place.object?.id === entryDTO.id) {
                            place.object = entryDTO
                        }
                        return place
                    });
                    return newData
                })
        })
    }

    const deletePlaceMutation = useMutation({
        mutationFn: PlaceControllerService.deletePlace,
    })

    async function deletePlace(id: number): Promise<void> {
        return deletePlaceMutation.mutateAsync(id).then(() => {
            queryClient.invalidateQueries({ queryKey: ["placePage", props.pageNumber, props.pageSize] })
        })
    }

    return {
        savePlace,
        editPlace,
        deletePlace
    }
}