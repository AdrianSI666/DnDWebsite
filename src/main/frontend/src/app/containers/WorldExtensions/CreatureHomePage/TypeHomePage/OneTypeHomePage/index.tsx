import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useParams } from "react-router-dom";
import { CreatureTypeControllerService, WorldDTO } from "../../../../../../services/openapi";
import useUserState from "../../../../../../services/storage/UserStorage";
import { FullEntryAccordionBody } from "../../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../../components/accordions/subCategoryBody";
import { UseOneTypeFunction } from "./useOneTypeFunction";
import { TypeFunctionArray } from "../../../../Creatures/TypePage/typeFunctionArrays";
import { TypeFunctionSubObjects } from "../../../../Creatures/TypePage/typeFunctionSubObjects";


export function OneTypeHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { typeName } = useParams<string>();
    const { status, data: type, error } = useQuery({
        queryKey: ["creatureType", typeName],
        queryFn: async () => CreatureTypeControllerService.getFullCreatureTypeByName(typeName!)
    })
    const { removeType, editType } = UseOneTypeFunction({ name: typeName!, worldName: world.world?.name! })
    const { saveImageToType, deleteImageFromType,
        addNewDesctiptionToType, updateTypeDescription, deleteDescriptionFromType } = TypeFunctionArray({ name: typeName! })
    const { getAllSpecies, saveNewSpeciesToType, saveExistingSpeciesToType, removeSpeciesFromTypeFunction,
        getAllPlanes, saveNewPlaneToCreatureType, saveExistingPlaneToCreatureType, removePlaneFromCreatureTypeFunction
     } = TypeFunctionSubObjects({ name: typeName! })

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Type named {typeName} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this type"}
        deleteEntry={removeType}
        updateEntry={editType} categoryName={"Type"} entryFullDTO={{
            object: type.creatureType,
            images: type.images,
            descriptions: type.descriptions
        }} isAuthor={isAuthor}>
        <FullEntryAccordionBody categoryName={"type"} entryFullDTO={{
            object: type.creatureType,
            images: type.images,
            descriptions: type.descriptions
        }}
            saveImageToEntry={saveImageToType}
            deleteImageFromEntry={deleteImageFromType}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToType}
            updateDescription={updateTypeDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromType} isAuthor={isAuthor}/>
        <SubCategoryBody mainEntryId={type.creatureType?.id!}
            subObjects={type.species}
            subCategoryTitle={"Species"} subCategoryLink={"creatures/species"}
            fillTheListWithAllSubObjects={getAllSpecies}
            addNewSubEntryToRelation={saveNewSpeciesToType}
            addExistingObjectToRelation={saveExistingSpeciesToType}
            deleteSubObject={removeSpeciesFromTypeFunction}
            addButtonActionText={"Add new species that use this type"}
            addExistingButtonActionText={"Link existing species from list to this type"}
            deleteButtonActionText={`Unlink this species from ${type.creatureType?.name}`}
            subCategoryLinkText={"species"} isAuthor={isAuthor}
            worldName={world.world?.name!}/>
        <SubCategoryBody mainEntryId={type.creatureType?.id!}
            subObjects={type.planes}
            subCategoryTitle={"Plane"} subCategoryLink={"geography/planes"}
            fillTheListWithAllSubObjects={getAllPlanes}
            addNewSubEntryToRelation={saveNewPlaneToCreatureType}
            addExistingObjectToRelation={saveExistingPlaneToCreatureType}
            deleteSubObject={removePlaneFromCreatureTypeFunction}
            addButtonActionText={"Add new plane on which this creature type exists"}
            addExistingButtonActionText={"Link existing plane from list to this creature type"}
            deleteButtonActionText={`Unlink this plane from ${type.creatureType?.name}`}
            subCategoryLinkText={"plane"} isAuthor={isAuthor}
            worldName={world.world?.name!}/>
    </OneEntryHeaderLayout>
}