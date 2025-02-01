
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useJWTManager from "../../../../../../services/jwt/JWTMenager"
import { EntryDTO, EntryFullDTO, KingdomCountyControllerService, OpenAPI } from "../../../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../../../components/types"

interface IAddDomObjectPayload {
    countyId: number,
    domObjectDTO: EntryDTO
}

interface ICountySubObjectIdsPayload {
    countyId: number,
    subObjectId: number
}

interface ICountyFunctionDomObjects {
    name: string
}

export function CountyFunctionDomObjects(props: ICountyFunctionDomObjects) {
    const queryClient = useQueryClient()

    const setNewKingdomToCountyMutation = useMutation({
        mutationFn: (payload: IAddDomObjectPayload) =>
            KingdomCountyControllerService.addNewKingdomCountyRelation(payload.countyId, payload.domObjectDTO),
    })

    const setNewKingdomToCounty = async (countyId: number, name: string, shortDescription: string): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        setNewKingdomToCountyMutation.mutateAsync({ countyId, domObjectDTO: entryDTO }).then(res => {
            queryClient.setQueryData(["county", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.domObjects = res
                return newData
            })
        })
    }

    const setKingdomToCountyMutation = useMutation({
        mutationFn: (payload: ICountySubObjectIdsPayload) => KingdomCountyControllerService.addKingdomCountyRelation(payload.subObjectId, payload.countyId),
    })

    const setExistingKingdomToCounty = async (args: addExistingObjectToRelation): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: args.objectName,
            shortDescription: args.objectDescription,
            id: args.objectToAddId
        }
        return setKingdomToCountyMutation.mutateAsync({ countyId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
            queryClient.setQueryData(["county", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.domObjects = entryDTO
                return newData
            })

        })
    }

    const removeKingdomFromCountyMutation = useMutation({
        mutationFn: (payload: ICountySubObjectIdsPayload) =>
            KingdomCountyControllerService.removeKingdomCountyRelation(payload.subObjectId, payload.countyId),
    })

    const removeKingdomFromCountyFunction = async (kingdomId: number, countyId: number): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return removeKingdomFromCountyMutation.mutateAsync({ countyId, subObjectId: kingdomId }).then(_ => {
            queryClient.setQueryData(["county", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    kingdom: {}
                } : oldData
                return newData
            })
        })
    }

    return { setNewKingdomToCounty, setExistingKingdomToCounty, removeKingdomFromCountyFunction };
}
