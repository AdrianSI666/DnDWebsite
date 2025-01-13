import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { CreatureTypeControllerService } from "../../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { TypeFunctionArray } from "../typeFunctionArrays";
import { TypeFunctionSubObjects } from "../typeFunctionSubObjects";
import { UseOneTypeFunction } from "../../../WorldExtensions/CreatureHomePage/TypeHomePage/OneTypeHomePage/useOneTypeFunction";

export function OneType() {
    let { name } = useParams<string>();
    const { status, data: type, error } = useQuery({
        queryKey: ["creatureType", name],
        queryFn: async () => CreatureTypeControllerService.getFullCreatureTypeByName(name!)
    })

    const { removeType, editType } = UseOneTypeFunction({ name: name! })
    const { saveImageToType, deleteImageFromType,
        addNewDesctiptionToType, updateTypeDescription, deleteDescriptionFromType } = TypeFunctionArray({ name: name! })
    const { getAllSpecies, saveNewSpeciesToType, saveExistingSpeciesToType, removeSpeciesFromTypeFunction } = TypeFunctionSubObjects({ name: name! })

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Type named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this type"}
        deleteEntry={removeType}
        updateEntry={editType} categoryName={"Type"} entryFullDTO={{
            object: type.creatureType,
            images: type.images,
            descriptions: type.descriptions
        }}>
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
            deleteDescriptionFromEntry={deleteDescriptionFromType} />
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
            subCategoryLinkText={"species"} />
    </OneEntryHeaderLayout>
}