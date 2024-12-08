
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EntryDTO, OpenAPI, SpeciesControllerService, SpeciesSubSpeciesControllerService, SubSpeciesDTO } from "../../../../services/openapi"
import { addExistingObjectToRelation } from "../../../components/types"
import useJWTManager from "../../../../services/jwt/JWTMenager"

interface IAddDomObjectPayload {
    subSpeciesId: number,
    domObjectDTO: EntryDTO
}

interface ISubSpeciesubObjectIdsPayload {
    subSpeciesId: number,
    subObjectId: number
}

interface ISubSpeciesFunctionDomObjects {
    name: string
}

export function SubSpeciesFunctionDomObjects(props: ISubSpeciesFunctionDomObjects) {
    const queryClient = useQueryClient()

    const getAllSpecies = async () => {
        return await SpeciesControllerService.getAllSpecies()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const setNewSpeciesToSubSpeciesMutation = useMutation({
        mutationFn: (payload: IAddDomObjectPayload) =>
            SpeciesSubSpeciesControllerService.addNewSpeciesRelation(payload.subSpeciesId, payload.domObjectDTO),
    })

    const setNewSpeciesToSubSpecies = async (subSpeciesId: number, name: string, shortDescription: string): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: name,
            shortDescription: shortDescription
        }
        setNewSpeciesToSubSpeciesMutation.mutateAsync({ subSpeciesId, domObjectDTO: entryDTO }).then(res => {
            queryClient.setQueryData(["subSpecies", props.name], (oldData: SubSpeciesDTO) => {
                const newData = oldData;
                newData.species = res
                return newData
            })
        })
    }

    const setSpeciesToSubSpeciesMutation = useMutation({
        mutationFn: (payload: ISubSpeciesubObjectIdsPayload) => SpeciesSubSpeciesControllerService.addSubSpeciesRelationSpecies(payload.subObjectId, payload.subSpeciesId),
    })

    const setExistingSpeciesToSubSpecies = async (args: addExistingObjectToRelation): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        let entryDTO: EntryDTO = {
            name: args.objectName,
            shortDescription: args.objectDescription,
            id: args.objectToAddId
        }
        return setSpeciesToSubSpeciesMutation.mutateAsync({ subSpeciesId: args.coreObjectId, subObjectId: args.objectToAddId }).then(_ => {
            queryClient.setQueryData(["subSpecies", props.name], (oldData: SubSpeciesDTO) => {
                const newData = oldData;
                newData.species = entryDTO
                return newData
            })

        })
    }

    const removeSpeciesFromSubSpeciesMutation = useMutation({
        mutationFn: (payload: ISubSpeciesubObjectIdsPayload) =>
            SpeciesSubSpeciesControllerService.removeSubSpeciesRelationSpecies(payload.subObjectId, payload.subSpeciesId),
    })

    const removeSpeciesFromSubSpeciesFunction = async (speciesId: number, subSpeciesId: number): Promise<void> => {
        OpenAPI.TOKEN = useJWTManager.getToken();
        return removeSpeciesFromSubSpeciesMutation.mutateAsync({ subSpeciesId, subObjectId: speciesId }).then(_ => {
            queryClient.setQueryData(["subSpecies", props.name], (oldData: SubSpeciesDTO) => {
                const newData = oldData ? {
                    ...oldData,
                    species: {}
                } : oldData
                return newData
            })
        })
    }

    return { setNewSpeciesToSubSpecies, setExistingSpeciesToSubSpecies, removeSpeciesFromSubSpeciesFunction, getAllSpecies };
}
