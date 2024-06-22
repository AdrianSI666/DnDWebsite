
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DescriptionDTO, EntryFullDTO, WorldControllerService } from "../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../globalFunctions/GlobalDescriptionFunction";

interface IAddDescriptionPayload {
    worldId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    acceptedFiles: Blob,
    worldId: number
}

interface IRemoveWorldSubObject {
    worldId: number,
    subObjectId: number
}

interface IWorldFunction {
    name: string
}

export function WorldFunctionArray(props: IWorldFunction) {
    const queryClient = useQueryClient()
    const saveDescriptionToWorldMutation = useMutation({
        mutationFn: (saveDescriptionToWorld: IAddDescriptionPayload) => WorldControllerService.saveDescriptionToWorld(saveDescriptionToWorld.worldId, saveDescriptionToWorld.descriptionDTO),
    })

    async function addNewDesctiptionToWorld(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return saveDescriptionToWorldMutation.mutateAsync({ worldId: id, descriptionDTO })
            .then((res) => {
                console.log(res)
                queryClient.setQueryData(["world", props.name], (oldData: EntryFullDTO) => {
                    const newData = oldData;
                    newData.descriptions?.push(res)
                    return newData
                })
            })
    }

    const { updateDescriptionMutation } = GlobalDescriptionFunction()

    async function updateWorldDescription(descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescriptionMutation.mutateAsync({ descriptionId, descriptionDTO }).then((res) => {
            queryClient.setQueryData(["world", props.name], (oldData: EntryFullDTO) => {
                const newData = {
                    ...oldData,
                    descriptions: oldData.descriptions?.map(desc => desc.id === descriptionId ? res : desc)
                };
                return newData
            })
        })
    }

    const deleteDescriptionFromWorldMutation = useMutation({
        mutationFn: (deleteDescFromWorld: IRemoveWorldSubObject) => WorldControllerService.deleteDescriptionFromWorld(deleteDescFromWorld.worldId, deleteDescFromWorld.subObjectId),
    })

    async function deleteDescriptionFromWorld(worldId: number, descriptionId: number): Promise<void> {
        return deleteDescriptionFromWorldMutation.mutateAsync({ worldId, subObjectId: descriptionId }).then(() => {
            queryClient.setQueryData(["world", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    descriptions: oldData.descriptions?.filter(description => description.id !== descriptionId)
                } : oldData
                return newData
            })
        })
    }

    const saveImageToWorldMutation = useMutation({
        mutationFn: (saveImageToWorld: IAddImagePayload) => WorldControllerService.saveImageToWorld(saveImageToWorld.worldId, { image: saveImageToWorld.acceptedFiles }),
    })

    async function saveImageToWorld(acceptedFiles: Blob, worldId: number) {
        return saveImageToWorldMutation.mutateAsync({ worldId, acceptedFiles }).then(res => {
            queryClient.setQueryData(["world", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.images?.push(res)
                return newData
            })
        })
    }

    const deleteImageFromWorldMutation = useMutation({
        mutationFn: (deleteImageFromWorld: IRemoveWorldSubObject) => WorldControllerService.deleteImageFromWorld(deleteImageFromWorld.worldId, deleteImageFromWorld.subObjectId),
    })

    async function deleteImageFromWorld(worldId: number, imageId: number): Promise<void> {
        return deleteImageFromWorldMutation.mutateAsync({ worldId, subObjectId: imageId }).then(() => {
            queryClient.setQueryData(["world", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    images: oldData.images?.filter(image => image.id !== imageId)
                } : oldData
                return newData
            })
        })
    }

    return {
        saveImageToWorld, deleteImageFromWorld,
        addNewDesctiptionToWorld, updateWorldDescription, deleteDescriptionFromWorld
    };
}