
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RaceControllerService, DescriptionDTO, RaceDTO } from "../../../../services/openapi";
import { GlobalDescriptionFunction } from "../../../globalFunctions/GlobalDescriptionFunction";

interface IAddDescriptionPayload {
    raceId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    acceptedFiles: Blob,
    raceId: number
}

interface IRemoveRaceSubObject {
    raceId: number,
    subObjectId: number
}

interface IRaceFunction {
    name: string
}

export function RaceFunctionArray(props: IRaceFunction) {
    const queryClient = useQueryClient()
    const saveDescriptionToRaceMutation = useMutation({
        mutationFn: (saveDescriptionToRace: IAddDescriptionPayload) => RaceControllerService.saveDescriptionToRace(saveDescriptionToRace.raceId, saveDescriptionToRace.descriptionDTO),
    })

    async function addNewDesctiptionToRace(id: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            title: title,
            text: text
        }
        return saveDescriptionToRaceMutation.mutateAsync({ raceId: id, descriptionDTO })
            .then((res) => {
                queryClient.setQueryData(["race", props.name], (oldData: RaceDTO) => {
                    const newData = oldData;
                    newData.descriptions?.push(res)
                    return newData
                })
            })
    }

    const { updateDescriptionMutation } = GlobalDescriptionFunction()

    async function updateRaceDescription(descriptionId: number, title: string, text: string) {
        let descriptionDTO: DescriptionDTO = {
            id: descriptionId,
            title: title,
            text: text
        }
        return updateDescriptionMutation.mutateAsync({ descriptionId, descriptionDTO }).then((res) => {
            queryClient.setQueryData(["race", props.name], (oldData: RaceDTO) => {
                const newData = {
                    ...oldData,
                    descriptions: oldData.descriptions?.map(desc => desc.id === descriptionId ? res : desc)
                };
                return newData
            })
        })
    }

    const deleteDescriptionFromRaceMutation = useMutation({
        mutationFn: (deleteDescFromRace: IRemoveRaceSubObject) => RaceControllerService.deleteDescriptionFromRace(deleteDescFromRace.raceId, deleteDescFromRace.subObjectId),
    })

    async function deleteDescriptionFromRace(raceId: number, descriptionId: number): Promise<void> {
        return deleteDescriptionFromRaceMutation.mutateAsync({ raceId, subObjectId: descriptionId }).then(() => {
            queryClient.setQueryData(["race", props.name], (oldData: RaceDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    descriptions: oldData.descriptions?.filter(description => description.id !== descriptionId)
                } : oldData
                return newData
            })
        })
    }

    const saveImageToRaceMutation = useMutation({
        mutationFn: (saveImageToRace: IAddImagePayload) => RaceControllerService.saveImageToRace(saveImageToRace.raceId, { image: saveImageToRace.acceptedFiles }),
    })

    async function saveImageToRace(acceptedFiles: Blob, raceId: number) {
        return saveImageToRaceMutation.mutateAsync({ raceId, acceptedFiles }).then(res => {
            queryClient.setQueryData(["race", props.name], (oldData: RaceDTO) => {
                const newData = oldData;
                newData.images?.push(res)
                return newData
            })
        })
    }

    const deleteImageFromRaceMutation = useMutation({
        mutationFn: (deleteImageFromRace: IRemoveRaceSubObject) => RaceControllerService.deleteImageFromRace(deleteImageFromRace.raceId, deleteImageFromRace.subObjectId),
    })

    async function deleteImageFromRace(raceId: number, imageId: number): Promise<void> {
        return deleteImageFromRaceMutation.mutateAsync({ raceId, subObjectId: imageId }).then(() => {
            queryClient.setQueryData(["race", props.name], (oldData: RaceDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    images: oldData.images?.filter(image => image.id !== imageId)
                } : oldData
                return newData
            })
        })
    }

    return {
        saveImageToRace, deleteImageFromRace,
        addNewDesctiptionToRace, updateRaceDescription, deleteDescriptionFromRace
    };
}