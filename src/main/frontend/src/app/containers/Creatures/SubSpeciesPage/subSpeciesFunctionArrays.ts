import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubSpeciesControllerService, DescriptionDTO, SubSpeciesDTO, OpenAPI } from "../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../globalFunctions/GlobalDescriptionFunction";
import useJWTManager from "../../../../services/jwt/JWTMenager";

interface IAddDescriptionPayload {
    subSpeciesId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    acceptedFiles: Blob,
    subSpeciesId: number
}

interface IRemoveSubSpeciesubObject {
    subSpeciesId: number,
    subObjectId: number
}

interface ISubSpeciesFunction {
    name: string
}

export function SubSpeciesFunctionArray(props: ISubSpeciesFunction) {
    const queryClient = useQueryClient()
    const saveDescriptionToSubSpeciesMutation = useMutation({
        mutationFn: (saveDescriptionToSubSpecies: IAddDescriptionPayload) => SubSpeciesControllerService.saveDescriptionToSubSpecies(saveDescriptionToSubSpecies.subSpeciesId, saveDescriptionToSubSpecies.descriptionDTO),
    })

    async function addNewDesctiptionToSubSpecies(id: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return saveDescriptionToSubSpeciesMutation.mutateAsync({ subSpeciesId: id, descriptionDTO })
            .then((res) => {
                queryClient.setQueryData(["subSpecies", props.name], (oldData: SubSpeciesDTO) => {
                    const newData = oldData;
                    newData.descriptions?.push(res)
                    return newData
                })
            })
    }

    const { updateDescriptionMutation } = GlobalDescriptionFunction()

    async function updateSubSpeciesDescription(descriptionId: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescriptionMutation.mutateAsync({ descriptionId, descriptionDTO }).then((res) => {
            queryClient.setQueryData(["subSpecies", props.name], (oldData: SubSpeciesDTO) => {
                const newData = {
                    ...oldData,
                    descriptions: oldData.descriptions?.map(desc => desc.id === descriptionId ? res : desc)
                };
                return newData
            })
        })
    }

    const deleteDescriptionFromSubSpeciesMutation = useMutation({
        mutationFn: (deleteDescFromSubSpecies: IRemoveSubSpeciesubObject) => SubSpeciesControllerService.deleteDescriptionFromSubSpecies(deleteDescFromSubSpecies.subSpeciesId, deleteDescFromSubSpecies.subObjectId),
    })

    async function deleteDescriptionFromSubSpecies(subSpeciesId: number, descriptionId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteDescriptionFromSubSpeciesMutation.mutateAsync({ subSpeciesId, subObjectId: descriptionId }).then(() => {
            queryClient.setQueryData(["subSpecies", props.name], (oldData: SubSpeciesDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    descriptions: oldData.descriptions?.filter(description => description.id !== descriptionId)
                } : oldData
                return newData
            })
        })
    }

    const saveImageToSubSpeciesMutation = useMutation({
        mutationFn: (saveImageToSubSpecies: IAddImagePayload) => SubSpeciesControllerService.saveImageToSubSpecies(saveImageToSubSpecies.subSpeciesId, { image: saveImageToSubSpecies.acceptedFiles }),
    })

    async function saveImageToSubSpecies(acceptedFiles: Blob, subSpeciesId: number) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveImageToSubSpeciesMutation.mutateAsync({ subSpeciesId, acceptedFiles }).then(res => {
            queryClient.setQueryData(["subSpecies", props.name], (oldData: SubSpeciesDTO) => {
                const newData = oldData;
                newData.images?.push(res)
                return newData
            })
        })
    }

    const deleteImageFromSubSpeciesMutation = useMutation({
        mutationFn: (deleteImageFromSubSpecies: IRemoveSubSpeciesubObject) => SubSpeciesControllerService.deleteImageFromSubSpecies(deleteImageFromSubSpecies.subSpeciesId, deleteImageFromSubSpecies.subObjectId),
    })

    async function deleteImageFromSubSpecies(subSpeciesId: number, imageId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteImageFromSubSpeciesMutation.mutateAsync({ subSpeciesId, subObjectId: imageId }).then(() => {
            queryClient.setQueryData(["subSpecies", props.name], (oldData: SubSpeciesDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    images: oldData.images?.filter(image => image.id !== imageId)
                } : oldData
                return newData
            })
        })
    }

    return {
        saveImageToSubSpecies, deleteImageFromSubSpecies,
        addNewDesctiptionToSubSpecies, updateSubSpeciesDescription, deleteDescriptionFromSubSpecies
    };
}