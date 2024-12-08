import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DescriptionDTO, EntryFullDTO, OpenAPI, PlaceControllerService } from "../../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../../globalFunctions/GlobalDescriptionFunction";
import useJWTManager from "../../../../../services/jwt/JWTMenager";

interface IAddDescriptionPayload {
    placeId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    acceptedFiles: Blob,
    placeId: number
}

interface IRemovePlaceSubObject {
    placeId: number,
    subObjectId: number
}

interface IPlaceFunction {
    name: string
}

export function PlaceFunctionArray(props: IPlaceFunction) {
    const queryClient = useQueryClient()
    const saveDescriptionToPlaceMutation = useMutation({
        mutationFn: (saveDescriptionToPlace: IAddDescriptionPayload) => PlaceControllerService.saveDescriptionToPlace(saveDescriptionToPlace.placeId, saveDescriptionToPlace.descriptionDTO),
    })

    async function addNewDesctiptionToPlace(id: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return saveDescriptionToPlaceMutation.mutateAsync({ placeId: id, descriptionDTO })
            .then((res) => {
                console.log(res)
                queryClient.setQueryData(["place", props.name], (oldData: EntryFullDTO) => {
                    const newData = oldData;
                    newData.descriptions?.push(res)
                    return newData
                })
            })
    }

    const { updateDescriptionMutation } = GlobalDescriptionFunction()

    async function updatePlaceDescription(descriptionId: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescriptionMutation.mutateAsync({ descriptionId, descriptionDTO }).then((res) => {
            queryClient.setQueryData(["place", props.name], (oldData: EntryFullDTO) => {
                const newData = {
                    ...oldData,
                    descriptions: oldData.descriptions?.map(desc => desc.id === descriptionId ? res : desc)
                };
                return newData
            })
        })
    }

    const deleteDescriptionFromPlaceMutation = useMutation({
        mutationFn: (deleteDescFromPlace: IRemovePlaceSubObject) => PlaceControllerService.deleteDescriptionFromPlace(deleteDescFromPlace.placeId, deleteDescFromPlace.subObjectId),
    })

    async function deleteDescriptionFromPlace(placeId: number, descriptionId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteDescriptionFromPlaceMutation.mutateAsync({ placeId, subObjectId: descriptionId }).then(() => {
            queryClient.setQueryData(["place", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    descriptions: oldData.descriptions?.filter(description => description.id !== descriptionId)
                } : oldData
                return newData
            })
        })
    }

    const saveImageToPlaceMutation = useMutation({
        mutationFn: (saveImageToPlace: IAddImagePayload) => PlaceControllerService.saveImageToPlace(saveImageToPlace.placeId, { image: saveImageToPlace.acceptedFiles }),
    })

    async function saveImageToPlace(acceptedFiles: Blob, placeId: number) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveImageToPlaceMutation.mutateAsync({ placeId, acceptedFiles }).then(res => {
            queryClient.setQueryData(["place", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.images?.push(res)
                return newData
            })
        })
    }

    const deleteImageFromPlaceMutation = useMutation({
        mutationFn: (deleteImageFromPlace: IRemovePlaceSubObject) => PlaceControllerService.deleteImageFromPlace(deleteImageFromPlace.placeId, deleteImageFromPlace.subObjectId),
    })

    async function deleteImageFromPlace(placeId: number, imageId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteImageFromPlaceMutation.mutateAsync({ placeId, subObjectId: imageId }).then(() => {
            queryClient.setQueryData(["place", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    images: oldData.images?.filter(image => image.id !== imageId)
                } : oldData
                return newData
            })
        })
    }

    return {
        saveImageToPlace, deleteImageFromPlace,
        addNewDesctiptionToPlace, updatePlaceDescription, deleteDescriptionFromPlace
    };
}