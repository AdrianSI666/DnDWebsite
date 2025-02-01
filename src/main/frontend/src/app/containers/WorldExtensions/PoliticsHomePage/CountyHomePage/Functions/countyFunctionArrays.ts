
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useJWTManager from "../../../../../../services/jwt/JWTMenager"
import { DescriptionDTO, CountyControllerService, OpenAPI, EntryFullDTO } from "../../../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../../../globalFunctions/GlobalDescriptionFunction";

interface IAddDescriptionPayload {
    countyId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    acceptedFiles: Blob,
    countyId: number
}

interface IRemoveCountySubObject {
    countyId: number,
    subObjectId: number
}

interface ICountyFunction {
    name: string
}

export function CountyFunctionArray(props: ICountyFunction) {
    const queryClient = useQueryClient()
    const saveDescriptionToCountyMutation = useMutation({
        mutationFn: (saveDescriptionToCounty: IAddDescriptionPayload) => CountyControllerService.saveDescriptionToCounty(saveDescriptionToCounty.countyId, saveDescriptionToCounty.descriptionDTO),
    })

    async function addNewDesctiptionToCounty(id: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return saveDescriptionToCountyMutation.mutateAsync({ countyId: id, descriptionDTO })
            .then((res) => {
                console.log(res)
                queryClient.setQueryData(["county", props.name], (oldData: EntryFullDTO) => {
                    const newData = oldData;
                    newData.descriptions?.push(res)
                    return newData
                })
            })
    }

    const { updateDescriptionMutation } = GlobalDescriptionFunction()

    async function updateCountyDescription(descriptionId: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescriptionMutation.mutateAsync({ descriptionId, descriptionDTO }).then((res) => {
            queryClient.setQueryData(["county", props.name], (oldData: EntryFullDTO) => {
                const newData = {
                    ...oldData,
                    descriptions: oldData.descriptions?.map(desc => desc.id === descriptionId ? res : desc)
                };
                return newData
            })
        })
    }

    const deleteDescriptionFromCountyMutation = useMutation({
        mutationFn: (deleteDescFromCounty: IRemoveCountySubObject) => CountyControllerService.deleteDescriptionFromCounty(deleteDescFromCounty.countyId, deleteDescFromCounty.subObjectId),
    })

    async function deleteDescriptionFromCounty(countyId: number, descriptionId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteDescriptionFromCountyMutation.mutateAsync({ countyId, subObjectId: descriptionId }).then(() => {
            queryClient.setQueryData(["county", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    descriptions: oldData.descriptions?.filter(description => description.id !== descriptionId)
                } : oldData
                return newData
            })
        })
    }

    const saveImageToCountyMutation = useMutation({
        mutationFn: (saveImageToCounty: IAddImagePayload) => CountyControllerService.saveImageToCounty(saveImageToCounty.countyId, { image: saveImageToCounty.acceptedFiles }),
    })

    async function saveImageToCounty(acceptedFiles: Blob, countyId: number) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveImageToCountyMutation.mutateAsync({ countyId, acceptedFiles }).then(res => {
            queryClient.setQueryData(["county", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.images?.push(res)
                return newData
            })
        })
    }

    const deleteImageFromCountyMutation = useMutation({
        mutationFn: (deleteImageFromCounty: IRemoveCountySubObject) => CountyControllerService.deleteImageFromCounty(deleteImageFromCounty.countyId, deleteImageFromCounty.subObjectId),
    })

    async function deleteImageFromCounty(countyId: number, imageId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteImageFromCountyMutation.mutateAsync({ countyId, subObjectId: imageId }).then(() => {
            queryClient.setQueryData(["county", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    images: oldData.images?.filter(image => image.id !== imageId)
                } : oldData
                return newData
            })
        })
    }

    return {
        saveImageToCounty, deleteImageFromCounty,
        addNewDesctiptionToCounty, updateCountyDescription, deleteDescriptionFromCounty
    };
}