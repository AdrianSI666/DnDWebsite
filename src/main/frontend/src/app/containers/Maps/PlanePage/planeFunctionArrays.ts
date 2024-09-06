import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DescriptionDTO, EntryFullDTO, OpenAPI, PlaneControllerService } from "../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../globalFunctions/GlobalDescriptionFunction";
import useJWTManager from "../../../../services/jwt/JWTMenager";

interface IAddDescriptionPayload {
    planeId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    acceptedFiles: Blob,
    planeId: number
}

interface IRemovePlaneSubObject {
    planeId: number,
    subObjectId: number
}

interface IPlaneFunction {
    name: string
}

export function PlaneFunctionArray(props: IPlaneFunction) {
    const queryClient = useQueryClient()
    const saveDescriptionToPlaneMutation = useMutation({
        mutationFn: (saveDescriptionToPlane: IAddDescriptionPayload) => PlaneControllerService.saveDescriptionToPlane(saveDescriptionToPlane.planeId, saveDescriptionToPlane.descriptionDTO),
    })

    async function addNewDesctiptionToPlane(id: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return saveDescriptionToPlaneMutation.mutateAsync({ planeId: id, descriptionDTO })
            .then((res) => {
                console.log(res)
                queryClient.setQueryData(["plane", props.name], (oldData: EntryFullDTO) => {
                    const newData = oldData;
                    newData.descriptions?.push(res)
                    return newData
                })
            })
    }

    const { updateDescriptionMutation } = GlobalDescriptionFunction()

    async function updatePlaneDescription(descriptionId: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescriptionMutation.mutateAsync({ descriptionId, descriptionDTO }).then((res) => {
            queryClient.setQueryData(["plane", props.name], (oldData: EntryFullDTO) => {
                const newData = {
                    ...oldData,
                    descriptions: oldData.descriptions?.map(desc => desc.id === descriptionId ? res : desc)
                };
                return newData
            })
        })
    }

    const deleteDescriptionFromPlaneMutation = useMutation({
        mutationFn: (deleteDescFromPlane: IRemovePlaneSubObject) => PlaneControllerService.deleteDescriptionFromPlane(deleteDescFromPlane.planeId, deleteDescFromPlane.subObjectId),
    })

    async function deleteDescriptionFromPlane(planeId: number, descriptionId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteDescriptionFromPlaneMutation.mutateAsync({ planeId, subObjectId: descriptionId }).then(() => {
            queryClient.setQueryData(["plane", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    descriptions: oldData.descriptions?.filter(description => description.id !== descriptionId)
                } : oldData
                return newData
            })
        })
    }

    const saveImageToPlaneMutation = useMutation({
        mutationFn: (saveImageToPlane: IAddImagePayload) => PlaneControllerService.saveImageToPlane(saveImageToPlane.planeId, { image: saveImageToPlane.acceptedFiles }),
    })

    async function saveImageToPlane(acceptedFiles: Blob, planeId: number) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveImageToPlaneMutation.mutateAsync({ planeId, acceptedFiles }).then(res => {
            queryClient.setQueryData(["plane", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.images?.push(res)
                return newData
            })
        })
    }

    const deleteImageFromPlaneMutation = useMutation({
        mutationFn: (deleteImageFromPlane: IRemovePlaneSubObject) => PlaneControllerService.deleteImageFromPlane(deleteImageFromPlane.planeId, deleteImageFromPlane.subObjectId),
    })

    async function deleteImageFromPlane(planeId: number, imageId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteImageFromPlaneMutation.mutateAsync({ planeId, subObjectId: imageId }).then(() => {
            queryClient.setQueryData(["plane", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    images: oldData.images?.filter(image => image.id !== imageId)
                } : oldData
                return newData
            })
        })
    }

    return {
        saveImageToPlane, deleteImageFromPlane,
        addNewDesctiptionToPlane, updatePlaneDescription, deleteDescriptionFromPlane
    };
}