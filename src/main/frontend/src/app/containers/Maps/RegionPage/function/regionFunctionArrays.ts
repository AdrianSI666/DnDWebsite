import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DescriptionDTO, EntryFullDTO, RegionControllerService } from "../../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../../globalFunctions/GlobalDescriptionFunction";

interface IAddDescriptionPayload {
    regionId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    acceptedFiles: Blob,
    regionId: number
}

interface IRemoveRegionSubObject {
    regionId: number,
    subObjectId: number
}

interface IRegionFunction {
    name: string
}

export function RegionFunctionArray(props: IRegionFunction) {
    const queryClient = useQueryClient()
    const saveDescriptionToRegionMutation = useMutation({
        mutationFn: (saveDescriptionToRegion: IAddDescriptionPayload) => RegionControllerService.saveDescriptionToRegion(saveDescriptionToRegion.regionId, saveDescriptionToRegion.descriptionDTO),
    })

    async function addNewDesctiptionToRegion(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return saveDescriptionToRegionMutation.mutateAsync({ regionId: id, descriptionDTO })
            .then((res) => {
                console.log(res)
                queryClient.setQueryData(["region", props.name], (oldData: EntryFullDTO) => {
                    const newData = oldData;
                    newData.descriptions?.push(res)
                    return newData
                })
            })
    }

    const { updateDescriptionMutation } = GlobalDescriptionFunction()

    async function updateRegionDescription(descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescriptionMutation.mutateAsync({ descriptionId, descriptionDTO }).then((res) => {
            queryClient.setQueryData(["region", props.name], (oldData: EntryFullDTO) => {
                const newData = {
                    ...oldData,
                    descriptions: oldData.descriptions?.map(desc => desc.id === descriptionId ? res : desc)
                };
                return newData
            })
        })
    }

    const deleteDescriptionFromRegionMutation = useMutation({
        mutationFn: (deleteDescFromRegion: IRemoveRegionSubObject) => RegionControllerService.deleteDescriptionFromRegion(deleteDescFromRegion.regionId, deleteDescFromRegion.subObjectId),
    })

    async function deleteDescriptionFromRegion(regionId: number, descriptionId: number): Promise<void> {
        return deleteDescriptionFromRegionMutation.mutateAsync({ regionId, subObjectId: descriptionId }).then(() => {
            queryClient.setQueryData(["region", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    descriptions: oldData.descriptions?.filter(description => description.id !== descriptionId)
                } : oldData
                return newData
            })
        })
    }

    const saveImageToRegionMutation = useMutation({
        mutationFn: (saveImageToRegion: IAddImagePayload) => RegionControllerService.saveImageToRegion(saveImageToRegion.regionId, { image: saveImageToRegion.acceptedFiles }),
    })

    async function saveImageToRegion(acceptedFiles: Blob, regionId: number) {
        return saveImageToRegionMutation.mutateAsync({ regionId, acceptedFiles }).then(res => {
            queryClient.setQueryData(["region", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.images?.push(res)
                return newData
            })
        })
    }

    const deleteImageFromRegionMutation = useMutation({
        mutationFn: (deleteImageFromRegion: IRemoveRegionSubObject) => RegionControllerService.deleteImageFromRegion(deleteImageFromRegion.regionId, deleteImageFromRegion.subObjectId),
    })

    async function deleteImageFromRegion(regionId: number, imageId: number): Promise<void> {
        return deleteImageFromRegionMutation.mutateAsync({ regionId, subObjectId: imageId }).then(() => {
            queryClient.setQueryData(["region", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    images: oldData.images?.filter(image => image.id !== imageId)
                } : oldData
                return newData
            })
        })
    }

    return {
        saveImageToRegion, deleteImageFromRegion,
        addNewDesctiptionToRegion, updateRegionDescription, deleteDescriptionFromRegion
    };
}