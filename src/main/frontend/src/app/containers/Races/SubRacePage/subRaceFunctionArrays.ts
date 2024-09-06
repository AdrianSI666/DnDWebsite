import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubRaceControllerService, DescriptionDTO, SubRaceDTO, OpenAPI } from "../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../globalFunctions/GlobalDescriptionFunction";
import useJWTManager from "../../../../services/jwt/JWTMenager";

interface IAddDescriptionPayload {
    subRaceId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    acceptedFiles: Blob,
    subRaceId: number
}

interface IRemoveSubRaceSubObject {
    subRaceId: number,
    subObjectId: number
}

interface ISubRaceFunction {
    name: string
}

export function SubRaceFunctionArray(props: ISubRaceFunction) {
    const queryClient = useQueryClient()
    const saveDescriptionToSubRaceMutation = useMutation({
        mutationFn: (saveDescriptionToSubRace: IAddDescriptionPayload) => SubRaceControllerService.saveDescriptionToSubRace(saveDescriptionToSubRace.subRaceId, saveDescriptionToSubRace.descriptionDTO),
    })

    async function addNewDesctiptionToSubRace(id: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return saveDescriptionToSubRaceMutation.mutateAsync({ subRaceId: id, descriptionDTO })
            .then((res) => {
                queryClient.setQueryData(["subRace", props.name], (oldData: SubRaceDTO) => {
                    const newData = oldData;
                    newData.descriptions?.push(res)
                    return newData
                })
            })
    }

    const { updateDescriptionMutation } = GlobalDescriptionFunction()

    async function updateSubRaceDescription(descriptionId: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescriptionMutation.mutateAsync({ descriptionId, descriptionDTO }).then((res) => {
            queryClient.setQueryData(["subRace", props.name], (oldData: SubRaceDTO) => {
                const newData = {
                    ...oldData,
                    descriptions: oldData.descriptions?.map(desc => desc.id === descriptionId ? res : desc)
                };
                return newData
            })
        })
    }

    const deleteDescriptionFromSubRaceMutation = useMutation({
        mutationFn: (deleteDescFromSubRace: IRemoveSubRaceSubObject) => SubRaceControllerService.deleteDescriptionFromSubRace(deleteDescFromSubRace.subRaceId, deleteDescFromSubRace.subObjectId),
    })

    async function deleteDescriptionFromSubRace(subRaceId: number, descriptionId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteDescriptionFromSubRaceMutation.mutateAsync({ subRaceId, subObjectId: descriptionId }).then(() => {
            queryClient.setQueryData(["subRace", props.name], (oldData: SubRaceDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    descriptions: oldData.descriptions?.filter(description => description.id !== descriptionId)
                } : oldData
                return newData
            })
        })
    }

    const saveImageToSubRaceMutation = useMutation({
        mutationFn: (saveImageToSubRace: IAddImagePayload) => SubRaceControllerService.saveImageToSubRace(saveImageToSubRace.subRaceId, { image: saveImageToSubRace.acceptedFiles }),
    })

    async function saveImageToSubRace(acceptedFiles: Blob, subRaceId: number) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveImageToSubRaceMutation.mutateAsync({ subRaceId, acceptedFiles }).then(res => {
            queryClient.setQueryData(["subRace", props.name], (oldData: SubRaceDTO) => {
                const newData = oldData;
                newData.images?.push(res)
                return newData
            })
        })
    }

    const deleteImageFromSubRaceMutation = useMutation({
        mutationFn: (deleteImageFromSubRace: IRemoveSubRaceSubObject) => SubRaceControllerService.deleteImageFromSubRace(deleteImageFromSubRace.subRaceId, deleteImageFromSubRace.subObjectId),
    })

    async function deleteImageFromSubRace(subRaceId: number, imageId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteImageFromSubRaceMutation.mutateAsync({ subRaceId, subObjectId: imageId }).then(() => {
            queryClient.setQueryData(["subRace", props.name], (oldData: SubRaceDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    images: oldData.images?.filter(image => image.id !== imageId)
                } : oldData
                return newData
            })
        })
    }

    return {
        saveImageToSubRace, deleteImageFromSubRace,
        addNewDesctiptionToSubRace, updateSubRaceDescription, deleteDescriptionFromSubRace
    };
}