
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, ContinentControllerService, ContinentKingdomControllerService, EntryFullDTO, OpenAPI } from "../../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../../components/types"
import useJWTManager from "../../../../../services/jwt/JWTMenager"

interface IAddDomObjectPayload {
    kingdomId: number,
    domObjectDTO: EntryDTO
}

interface IKingdomSubObjectIdsPayload {
    kingdomId: number,
    subObjectId: number
}

interface IKingdomFunctionDomObjects {
    name: string
}

export function KingdomFunctionDomObjects(props: IKingdomFunctionDomObjects) {
    const queryClient = useQueryClient()

    const getAllContinents = async () => {
        return await ContinentControllerService.getAllContinents()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const setNewContinentToKingdomMutation = useMutation({
        mutationFn: (payload: IAddDomObjectPayload) =>
            ContinentKingdomControllerService.addNewContinentKingdomRelation(payload.kingdomId, payload.domObjectDTO),
    })

    const setNewContinentToKingdom = async (kingdomId: number, name: string, shortDescription: string): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        setNewContinentToKingdomMutation.mutateAsync({ kingdomId, domObjectDTO: entryDTO }).then(res => {
            queryClient.setQueryData(["kingdom", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.domObjects = res
                return newData
            })
        })
    }

    const setContinentToKingdomMutation = useMutation({
        mutationFn: (payload: IKingdomSubObjectIdsPayload) => ContinentKingdomControllerService.addContinentKingdomRelation(payload.subObjectId, payload.kingdomId),
    })

    const setExistingContinentToKingdom = async (args: addExistingObjectToRelation): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: args.objectName,
            shortDescription: args.objectDescription,
            id: args.objectToAddId
        }
        return setContinentToKingdomMutation.mutateAsync({ kingdomId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
            queryClient.setQueryData(["kingdom", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData;
                newData.domObjects = entryDTO
                return newData
            })

        })
    }

    const removeContinentFromKingdomMutation = useMutation({
        mutationFn: (payload: IKingdomSubObjectIdsPayload) =>
            ContinentKingdomControllerService.removeContinentKingdomRelation(payload.subObjectId, payload.kingdomId),
    })

    const removeContinentFromKingdomFunction = async (continentId: number, kingdomId: number): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return removeContinentFromKingdomMutation.mutateAsync({ kingdomId, subObjectId: continentId }).then(_ => {
            queryClient.setQueryData(["kingdom", props.name], (oldData: EntryFullDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    continent: {}
                } : oldData
                return newData
            })
        })
    }

    return { setNewContinentToKingdom, setExistingContinentToKingdom, removeContinentFromKingdomFunction, getAllContinents };
}
