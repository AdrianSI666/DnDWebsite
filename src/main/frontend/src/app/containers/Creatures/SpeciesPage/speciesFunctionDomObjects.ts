
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, OpenAPI, CreatureTypeControllerService, CreatureTypeSpeciesControllerService, SpeciesDTO } from "../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../components/types"
import useJWTManager from "../../../../services/jwt/JWTMenager"

interface IAddDomObjectPayload {
    speciesId: number,
    domObjectDTO: EntryDTO
}

interface ISpeciesubObjectIdsPayload {
    speciesId: number,
    subObjectId: number
}

interface ISpeciesFunctionDomObjects {
    name: string
}

export function SpeciesFunctionDomObjects(props: ISpeciesFunctionDomObjects) {
    const queryClient = useQueryClient()

    const getAllCreatureType = async () => {
        return await CreatureTypeControllerService.getAllCreatureTypes()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const setNewCreatureTypeToSpeciesMutation = useMutation({
        mutationFn: (payload: IAddDomObjectPayload) =>
            CreatureTypeSpeciesControllerService.addNewCreatureTypeRelation(payload.speciesId, payload.domObjectDTO),
    })

    const setNewCreatureTypeToSpecies = async (speciesId: number, name: string, shortDescription: string): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        setNewCreatureTypeToSpeciesMutation.mutateAsync({ speciesId, domObjectDTO: entryDTO }).then(res => {
            queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
                const newData = oldData;
                newData.creatureType = res
                return newData
            })
        })
    }

    const setCreatureTypeToSpeciesMutation = useMutation({
        mutationFn: (payload: ISpeciesubObjectIdsPayload) => CreatureTypeSpeciesControllerService.addSpeciesRelationCreatureType(payload.subObjectId, payload.speciesId),
    })

    const setExistingCreatureTypeToSpecies = async (args: addExistingObjectToRelation): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: args.objectName,
            shortDescription: args.objectDescription,
            id: args.objectToAddId
        }
        return setCreatureTypeToSpeciesMutation.mutateAsync({ speciesId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
            queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
                const newData = oldData;
                newData.creatureType = entryDTO
                return newData
            })

        })
    }

    const removeCreatureTypeFromSpeciesMutation = useMutation({
        mutationFn: (payload: ISpeciesubObjectIdsPayload) =>
            CreatureTypeSpeciesControllerService.removeSpeciesRelationCreatureType(payload.subObjectId, payload.speciesId),
    })

    const removeCreatureTypeFromSpeciesFunction = async (creaturetypeId: number, speciesId: number): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return removeCreatureTypeFromSpeciesMutation.mutateAsync({ speciesId, subObjectId: creaturetypeId }).then(_ => {
            queryClient.setQueryData(["species", props.name], (oldData: SpeciesDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    creaturetype: {}
                } : oldData
                return newData
            })
        })
    }

    return { setNewCreatureTypeToSpecies, setExistingCreatureTypeToSpecies, removeCreatureTypeFromSpeciesFunction, getAllCreatureType };
}
