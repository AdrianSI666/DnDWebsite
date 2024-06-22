
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, RaceControllerService, RaceSubRaceControllerService, SubRaceDTO } from "../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../components/types"

interface IAddDomObjectPayload {
    subRaceId: number,
    domObjectDTO: EntryDTO
}

interface ISubRaceSubObjectIdsPayload {
    subRaceId: number,
    subObjectId: number
}

interface ISubRaceFunctionDomObjects {
    name: string
}

export function SubRaceFunctionDomObjects(props: ISubRaceFunctionDomObjects) {
    const queryClient = useQueryClient()

    const getAllRaces = async () => {
        return await RaceControllerService.getAllRaces()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const setNewRaceToSubRaceMutation = useMutation({
        mutationFn: (payload: IAddDomObjectPayload) =>
            RaceSubRaceControllerService.addNewRaceRelation(payload.subRaceId, payload.domObjectDTO),
    })

    const setNewRaceToSubRace = async (subRaceId: number, name: string, shortDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        setNewRaceToSubRaceMutation.mutateAsync({ subRaceId, domObjectDTO: entryDTO }).then(res => {
            queryClient.setQueryData(["subRace", props.name], (oldData: SubRaceDTO) => {
                const newData = oldData;
                newData.race = res
                return newData
            })
        })
    }

    const setRaceToSubRaceMutation = useMutation({
        mutationFn: (payload: ISubRaceSubObjectIdsPayload) => RaceSubRaceControllerService.addSubRaceRelationRace(payload.subObjectId, payload.subRaceId),
    })

    const setExistingRaceToSubRace = async (args: addExistingObjectToRelation): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: args.objectName,
            shortDescription: args.objectDescription,
            id: args.objectToAddId
        }
        return setRaceToSubRaceMutation.mutateAsync({ subRaceId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
            queryClient.setQueryData(["subRace", props.name], (oldData: SubRaceDTO) => {
                const newData = oldData;
                newData.race = entryDTO
                return newData
            })

        })
    }

    const removeRaceFromSubRaceMutation = useMutation({
        mutationFn: (payload: ISubRaceSubObjectIdsPayload) =>
            RaceSubRaceControllerService.removeSubRaceRelationRace(payload.subObjectId, payload.subRaceId),
    })

    const removeRaceFromSubRaceFunction = async (raceId: number, subRaceId: number): Promise<void> => {
        return removeRaceFromSubRaceMutation.mutateAsync({ subRaceId, subObjectId: raceId }).then(_ => {
            queryClient.setQueryData(["subRace", props.name], (oldData: SubRaceDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    race: {}
                } : oldData
                return newData
            })
        })
    }

    return { setNewRaceToSubRace, setExistingRaceToSubRace, removeRaceFromSubRaceFunction, getAllRaces };
}
