
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DescriptionDTO, EntryFullDTO, KingdomControllerService, OpenAPI } from "../../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../../globalFunctions/GlobalDescriptionFunction";
import useJWTManager from "../../../../../services/jwt/JWTMenager";

interface IAddDescriptionPayload {
    kingdomId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    acceptedFiles: Blob,
    kingdomId: number
}

interface IRemoveKingdomSubObject {
    kingdomId: number,
    subObjectId: number
}

interface IKingdomFunction {
    name: string
}

export function KingdomFunctionArray(props: IKingdomFunction) {
    const queryClient = useQueryClient()
    const saveDescriptionToKingdomMutation = useMutation({
        mutationFn: (saveDescriptionToKingdom: IAddDescriptionPayload) => KingdomControllerService.saveDescriptionToKingdom(saveDescriptionToKingdom.kingdomId, saveDescriptionToKingdom.descriptionDTO),
    })

    async function addNewDesctiptionToKingdom(id: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return saveDescriptionToKingdomMutation.mutateAsync({ kingdomId: id, descriptionDTO })
            .then((res) => {
                console.log(res)
                queryClient.setQueryData(["kingdom", props.name], (oldData: EntryFullDTO) => {
                    const newData = oldData;
                    newData.descriptions?.push(res)
                    return newData
                })
            })
    }

    const { updateDescriptionMutation } = GlobalDescriptionFunction()

    async function updateKingdomDescription(descriptionId: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescriptionMutation.mutateAsync({ descriptionId, descriptionDTO }).then((res) => {
            queryClient.setQueryData(["kingdom", props.name], (oldData: EntryFullDTO) => {
                const newData = {
                    ...oldData,
                    descriptions: oldData.descriptions?.map(desc => desc.id === descriptionId ? res : desc)
                };
                return newData
            })
        })
    }

    const deleteDescriptionFromKingdomMutation = useMutation({
        mutationFn: (deleteDescFromKingdom: IRemoveKingdomSubObject) => KingdomControllerService.deleteDescriptionFromKingdom(deleteDescFromKingdom.kingdomId, deleteDescFromKingdom.subObjectId),
    })

    async function deleteDescriptionFromKingdom(kingdomId: number, descriptionId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteDescriptionFromKingdomMutation.mutateAsync({ kingdomId, subObjectId: descriptionId }).then(() => {
            queryClient.setQueryData(["kingdom", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    descriptions: oldData.descriptions?.filter(description => description.id !== descriptionId)
                } : oldData
                return newData
            })
        })
    }

    const saveImageToKingdomMutation = useMutation({
        mutationFn: (saveImageToKingdom: IAddImagePayload) => KingdomControllerService.saveImageToKingdom(saveImageToKingdom.kingdomId, { image: saveImageToKingdom.acceptedFiles }),
    })

    async function saveImageToKingdom(acceptedFiles: Blob, kingdomId: number) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveImageToKingdomMutation.mutateAsync({ kingdomId, acceptedFiles }).then(res => {
            queryClient.setQueryData(["kingdom", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.images?.push(res)
                return newData
            })
        })
    }

    const deleteImageFromKingdomMutation = useMutation({
        mutationFn: (deleteImageFromKingdom: IRemoveKingdomSubObject) => KingdomControllerService.deleteImageFromKingdom(deleteImageFromKingdom.kingdomId, deleteImageFromKingdom.subObjectId),
    })

    async function deleteImageFromKingdom(kingdomId: number, imageId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteImageFromKingdomMutation.mutateAsync({ kingdomId, subObjectId: imageId }).then(() => {
            queryClient.setQueryData(["kingdom", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    images: oldData.images?.filter(image => image.id !== imageId)
                } : oldData
                return newData
            })
        })
    }

    return {
        saveImageToKingdom, deleteImageFromKingdom,
        addNewDesctiptionToKingdom, updateKingdomDescription, deleteDescriptionFromKingdom
    };
}