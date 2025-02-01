
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useJWTManager from "../../../../../../services/jwt/JWTMenager";
import { CreatureTypeControllerService, CreatureTypeDTO, DescriptionDTO, OpenAPI } from "../../../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../../../globalFunctions/GlobalDescriptionFunction";

interface IAddDescriptionPayload {
    typeId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    acceptedFiles: Blob,
    typeId: number
}

interface IRemoveTypesubObject {
    typeId: number,
    subObjectId: number
}

interface ITypeFunction {
    name: string
}

export function TypeFunctionArray(props: ITypeFunction) {
    const queryClient = useQueryClient()
    const saveDescriptionToTypeMutation = useMutation({
        mutationFn: (saveDescriptionToType: IAddDescriptionPayload) => CreatureTypeControllerService.saveDescriptionToCreatureType(saveDescriptionToType.typeId, saveDescriptionToType.descriptionDTO),
    })

    async function addNewDesctiptionToType(id: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return saveDescriptionToTypeMutation.mutateAsync({ typeId: id, descriptionDTO })
            .then((res) => {
                queryClient.setQueryData(["creatureType", props.name], (oldData: CreatureTypeDTO) => {
                    const newData = oldData;
                    newData.descriptions?.push(res)
                    return newData
                })
            })
    }

    const { updateDescriptionMutation } = GlobalDescriptionFunction()

    async function updateTypeDescription(descriptionId: number, title: string, text: string) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescriptionMutation.mutateAsync({ descriptionId, descriptionDTO }).then((res) => {
            queryClient.setQueryData(["creatureType", props.name], (oldData: CreatureTypeDTO) => {
                const newData = {
                    ...oldData,
                    descriptions: oldData.descriptions?.map(desc => desc.id === descriptionId ? res : desc)
                };
                return newData
            })
        })
    }

    const deleteDescriptionFromTypeMutation = useMutation({
        mutationFn: (deleteDescFromType: IRemoveTypesubObject) => CreatureTypeControllerService.deleteDescriptionFromCreatureType(deleteDescFromType.typeId, deleteDescFromType.subObjectId),
    })

    async function deleteDescriptionFromType(typeId: number, descriptionId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteDescriptionFromTypeMutation.mutateAsync({ typeId, subObjectId: descriptionId }).then(() => {
            queryClient.setQueryData(["creatureType", props.name], (oldData: CreatureTypeDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    descriptions: oldData.descriptions?.filter(description => description.id !== descriptionId)
                } : oldData
                return newData
            })
        })
    }

    const saveImageToTypeMutation = useMutation({
        mutationFn: (saveImageToType: IAddImagePayload) => CreatureTypeControllerService.saveImageToCreatureType(saveImageToType.typeId, { image: saveImageToType.acceptedFiles }),
    })

    async function saveImageToType(acceptedFiles: Blob, typeId: number) {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return saveImageToTypeMutation.mutateAsync({ typeId, acceptedFiles }).then(res => {
            queryClient.setQueryData(["creatureType", props.name], (oldData: CreatureTypeDTO) => {
                const newData = oldData;
                newData.images?.push(res)
                return newData
            })
        })
    }

    const deleteImageFromTypeMutation = useMutation({
        mutationFn: (deleteImageFromType: IRemoveTypesubObject) => CreatureTypeControllerService.deleteImageFromCreatureType(deleteImageFromType.typeId, deleteImageFromType.subObjectId),
    })

    async function deleteImageFromType(typeId: number, imageId: number): Promise<void> {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return deleteImageFromTypeMutation.mutateAsync({ typeId, subObjectId: imageId }).then(() => {
            queryClient.setQueryData(["creatureType", props.name], (oldData: CreatureTypeDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    images: oldData.images?.filter(image => image.id !== imageId)
                } : oldData
                return newData
            })
        })
    }

    return {
        saveImageToType, deleteImageFromType,
        addNewDesctiptionToType, updateTypeDescription, deleteDescriptionFromType
    };
}