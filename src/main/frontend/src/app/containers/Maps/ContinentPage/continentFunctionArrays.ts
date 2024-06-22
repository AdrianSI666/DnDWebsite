
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DescriptionDTO, EntryFullDTO, ContinentControllerService } from "../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../globalFunctions/GlobalDescriptionFunction";

interface IAddDescriptionPayload {
    continentId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    acceptedFiles: Blob,
    continentId: number
}

interface IRemoveContinentSubObject {
    continentId: number,
    subObjectId: number
}

interface IContinentFunction {
    name: string
}

export function ContinentFunctionArray(props: IContinentFunction) {
    const queryClient = useQueryClient()
    const saveDescriptionToContinentMutation = useMutation({
        mutationFn: (saveDescriptionToContinent: IAddDescriptionPayload) =>
            ContinentControllerService.saveDescriptionToContinent(saveDescriptionToContinent.continentId, saveDescriptionToContinent.descriptionDTO),
    })

    async function addNewDesctiptionToContinent(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return saveDescriptionToContinentMutation.mutateAsync({ continentId: id, descriptionDTO })
            .then((res) => {
                console.log(res)
                queryClient.setQueryData(["continent", props.name], (oldData: EntryFullDTO) => {
                    const newData = oldData;
                    newData.descriptions?.push(res)
                    return newData
                })
            })
    }

    const { updateDescriptionMutation } = GlobalDescriptionFunction()

    async function updateContinentDescription(descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescriptionMutation.mutateAsync({ descriptionId, descriptionDTO }).then((res) => {
            queryClient.setQueryData(["continent", props.name], (oldData: EntryFullDTO) => {
                const newData = {
                    ...oldData,
                    descriptions: oldData.descriptions?.map(desc => desc.id === descriptionId ? res : desc)
                };
                return newData
            })
        })
    }

    const deleteDescriptionFromContinentMutation = useMutation({
        mutationFn: (deleteDescFromContinent: IRemoveContinentSubObject) =>
            ContinentControllerService.deleteDescriptionFromContinent(deleteDescFromContinent.continentId, deleteDescFromContinent.subObjectId),
    })

    async function deleteDescriptionFromContinent(continentId: number, descriptionId: number): Promise<void> {
        return deleteDescriptionFromContinentMutation.mutateAsync({ continentId, subObjectId: descriptionId }).then(() => {
            queryClient.setQueryData(["continent", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    descriptions: oldData.descriptions?.filter(description => description.id !== descriptionId)
                } : oldData
                return newData
            })
        })
    }

    const saveImageToContinentMutation = useMutation({
        mutationFn: (saveImageToContinent: IAddImagePayload) =>
            ContinentControllerService.saveImageToContinent(saveImageToContinent.continentId, { image: saveImageToContinent.acceptedFiles }),
    })

    async function saveImageToContinent(acceptedFiles: Blob, continentId: number) {
        return saveImageToContinentMutation.mutateAsync({ continentId, acceptedFiles }).then(res => {
            queryClient.setQueryData(["continent", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.images?.push(res)
                return newData
            })
        })
    }

    const deleteImageFromContinentMutation = useMutation({
        mutationFn: (deleteImageFromContinent: IRemoveContinentSubObject) =>
            ContinentControllerService.deleteImageFromContinent(deleteImageFromContinent.continentId, deleteImageFromContinent.subObjectId),
    })

    async function deleteImageFromContinent(continentId: number, imageId: number): Promise<void> {
        return deleteImageFromContinentMutation.mutateAsync({ continentId, subObjectId: imageId }).then(() => {
            queryClient.setQueryData(["continent", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    images: oldData.images?.filter(image => image.id !== imageId)
                } : oldData
                return newData
            })
        })
    }

    return {
        saveImageToContinent, deleteImageFromContinent,
        addNewDesctiptionToContinent, updateContinentDescription, deleteDescriptionFromContinent
    };
}