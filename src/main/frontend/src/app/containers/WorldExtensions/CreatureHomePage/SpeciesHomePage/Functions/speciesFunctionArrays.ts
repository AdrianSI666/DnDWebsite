
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SpeciesControllerService, DescriptionDTO, SpeciesDTO, OpenAPI } from "../../../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../../../globalFunctions/GlobalDescriptionFunction";
import useJWTManager from "../../../../../../services/jwt/JWTMenager";

interface IAddDescriptionPayload {
    speciesId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    acceptedFiles: Blob,
    speciesId: number
}

interface IRemoveSpeciesubObject {
    speciesId: number,
    subObjectId: number
}

interface ISpeciesFunction {
    name: string
}

export function SpeciesFunctionArray(props: ISpeciesFunction) {
    const queryClient = useQueryClient()
    const saveDescriptionToSpeciesMutation = useMutation({
        mutationFn: (saveDescriptionToSpecies: IAddDescriptionPayload) => SpeciesControllerService.saveDescriptionToSpecies(saveDescriptionToSpecies.speciesId, saveDescriptionToSpecies.descriptionDTO),
    })

    async function addNewDesctiptionToSpecies(id: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return saveDescriptionToSpeciesMutation.mutateAsync({ speciesId: id, descriptionDTO })
            .then((res) => {
                queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
                    const newData = oldData;
                    newData.descriptions?.push(res)
                    return newData
                })
            })
    }

    const { updateDescriptionMutation } = GlobalDescriptionFunction()

    async function updateSpeciesDescription(descriptionId: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescriptionMutation.mutateAsync({ descriptionId, descriptionDTO }).then((res) => {
            queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
                const newData = {
                    ...oldData,
                    descriptions: oldData.descriptions?.map(desc => desc.id === descriptionId ? res : desc)
                };
                return newData
            })
        })
    }

    const deleteDescriptionFromSpeciesMutation = useMutation({
        mutationFn: (deleteDescFromSpecies: IRemoveSpeciesubObject) => SpeciesControllerService.deleteDescriptionFromSpecies(deleteDescFromSpecies.speciesId, deleteDescFromSpecies.subObjectId),
    })

    async function deleteDescriptionFromSpecies(speciesId: number, descriptionId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteDescriptionFromSpeciesMutation.mutateAsync({ speciesId, subObjectId: descriptionId }).then(() => {
            queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    descriptions: oldData.descriptions?.filter(description => description.id !== descriptionId)
                } : oldData
                return newData
            })
        })
    }

    const saveImageToSpeciesMutation = useMutation({
        mutationFn: (saveImageToSpecies: IAddImagePayload) => SpeciesControllerService.saveImageToSpecies(saveImageToSpecies.speciesId, { image: saveImageToSpecies.acceptedFiles }),
    })

    async function saveImageToSpecies(acceptedFiles: Blob, speciesId: number) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveImageToSpeciesMutation.mutateAsync({ speciesId, acceptedFiles }).then(res => {
            queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
                const newData = oldData;
                newData.images?.push(res)
                return newData
            })
        })
    }

    const deleteImageFromSpeciesMutation = useMutation({
        mutationFn: (deleteImageFromSpecies: IRemoveSpeciesubObject) => SpeciesControllerService.deleteImageFromSpecies(deleteImageFromSpecies.speciesId, deleteImageFromSpecies.subObjectId),
    })

    async function deleteImageFromSpecies(speciesId: number, imageId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteImageFromSpeciesMutation.mutateAsync({ speciesId, subObjectId: imageId }).then(() => {
            queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    images: oldData.images?.filter(image => image.id !== imageId)
                } : oldData
                return newData
            })
        })
    }

    return {
        saveImageToSpecies, deleteImageFromSpecies,
        addNewDesctiptionToSpecies, updateSpeciesDescription, deleteDescriptionFromSpecies
    };
}