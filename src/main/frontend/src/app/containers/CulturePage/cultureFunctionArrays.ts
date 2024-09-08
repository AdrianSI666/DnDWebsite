
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CultureControllerService, DescriptionDTO, EntryFullDTO, OpenAPI } from "../../../services/openapi";
import { GlobalDescriptionFunction } from "../../globalFunctions/GlobalDescriptionFunction";
import useJWTManager from "../../../services/jwt/JWTMenager";

interface IAddDescriptionPayload {
    cultureId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    acceptedFiles: Blob,
    cultureId: number
}

interface IRemoveCultureSubObject {
    cultureId: number,
    subObjectId: number
}

interface ICultureFunction {
    name: string
}

export function CultureFunctionArray(props: ICultureFunction) {
    const queryClient = useQueryClient()
    const saveDescriptionToCultureMutation = useMutation({
        mutationFn: (saveDescriptionToCulture: IAddDescriptionPayload) => CultureControllerService.saveDescriptionToCulture(saveDescriptionToCulture.cultureId, saveDescriptionToCulture.descriptionDTO),
    })

    async function addNewDesctiptionToCulture(id: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return saveDescriptionToCultureMutation.mutateAsync({ cultureId: id, descriptionDTO })
            .then((res) => {
                queryClient.setQueryData(["culture", props.name], (oldData: EntryFullDTO) => {
                    const newData = oldData;
                    newData.descriptions?.push(res)
                    return newData
                })
            })
    }

    const { updateDescriptionMutation } = GlobalDescriptionFunction()

    async function updateCultureDescription(descriptionId: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescriptionMutation.mutateAsync({ descriptionId, descriptionDTO }).then((res) => {
            queryClient.setQueryData(["culture", props.name], (oldData: EntryFullDTO) => {
                const newData = {
                    ...oldData,
                    descriptions: oldData.descriptions?.map(desc => desc.id === descriptionId ? res : desc)
                };
                return newData
            })
        })
    }

    const deleteDescriptionFromCultureMutation = useMutation({
        mutationFn: (deleteDescFromCulture: IRemoveCultureSubObject) => CultureControllerService.deleteDescriptionFromCulture(deleteDescFromCulture.cultureId, deleteDescFromCulture.subObjectId),
    })

    async function deleteDescriptionFromCulture(cultureId: number, descriptionId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteDescriptionFromCultureMutation.mutateAsync({ cultureId, subObjectId: descriptionId }).then(() => {
            queryClient.setQueryData(["culture", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    descriptions: oldData.descriptions?.filter(description => description.id !== descriptionId)
                } : oldData
                return newData
            })
        })
    }

    const saveImageToCultureMutation = useMutation({
        mutationFn: (saveImageToCulture: IAddImagePayload) => CultureControllerService.saveImageToCulture(saveImageToCulture.cultureId, { image: saveImageToCulture.acceptedFiles }),
    })

    async function saveImageToCulture(acceptedFiles: Blob, cultureId: number) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveImageToCultureMutation.mutateAsync({ cultureId, acceptedFiles }).then(res => {
            queryClient.setQueryData(["culture", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.images?.push(res)
                return newData
            })
        })
    }

    const deleteImageFromCultureMutation = useMutation({
        mutationFn: (deleteImageFromCulture: IRemoveCultureSubObject) => CultureControllerService.deleteImageFromCulture(deleteImageFromCulture.cultureId, deleteImageFromCulture.subObjectId),
    })

    async function deleteImageFromCulture(cultureId: number, imageId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteImageFromCultureMutation.mutateAsync({ cultureId, subObjectId: imageId }).then(() => {
            queryClient.setQueryData(["culture", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    images: oldData.images?.filter(image => image.id !== imageId)
                } : oldData
                return newData
            })
        })
    }

    return {
        saveImageToCulture, deleteImageFromCulture,
        addNewDesctiptionToCulture, updateCultureDescription, deleteDescriptionFromCulture
    };
}