import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";

import { useQuery } from "@tanstack/react-query";
import { KingdomControllerService } from "../../../../../services/openapi";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { KingdomFunctionArray } from "../function/kingdomFunctionArrays";
import { KingdomFunctionSubObjects } from "../function/kingdomFunctionSubObjects";
import { UseOneKingdomFunction } from "./useOneKingdomFunction";

export function OneKingdom() {
    let { name } = useParams();
    const { status, data: kingdomDTO, error } = useQuery({
        queryKey: ["kingdom", name],
        queryFn: async () => KingdomControllerService.getKingdomByName(name!)
    })

    const { removeKingdom, editKingdom } = UseOneKingdomFunction({ name: name! });
    const { saveImageToKingdom, deleteImageFromKingdom,
        addNewDesctiptionToKingdom, updateKingdomDescription, deleteDescriptionFromKingdom } = KingdomFunctionArray({ name: name! })
    const { getAllCountiesWithoutKingdom,
        saveExistingCountyToKingdom, removeCountyFromKingdomFunction, saveNewCountyToKingdom,
        getAllContinets, saveNewContinentToKingdom, saveExistingContinentToKingdom, removeContinentFromKingdomFunction } = KingdomFunctionSubObjects({ name: name! })

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Kingdom named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this kingdom"}
        deleteEntry={removeKingdom}
        updateEntry={editKingdom} categoryName={"Kingdom"}
        entryFullDTO={{
            object: kingdomDTO.object,
            images: kingdomDTO.images,
            descriptions: kingdomDTO.descriptions
        }}>
        <FullEntryAccordionBody categoryName={"Kingdom"} entryFullDTO={{
            object: kingdomDTO.object,
            images: kingdomDTO.images,
            descriptions: kingdomDTO.descriptions
        }}
            saveImageToEntry={saveImageToKingdom}
            deleteImageFromEntry={deleteImageFromKingdom}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToKingdom}
            updateDescription={updateKingdomDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromKingdom} />
        <SubCategoryBody mainEntryId={kingdomDTO.object?.id!}
            subObjects={kingdomDTO.counties}
            subCategoryTitle={"Counties"} subCategoryLink={"/politics/counties"}
            fillTheListWithAllSubObjects={getAllCountiesWithoutKingdom}
            addExistingObjectToRelation={saveExistingCountyToKingdom}
            deleteSubObject={removeCountyFromKingdomFunction}
            addNewSubEntryToRelation={saveNewCountyToKingdom}
            addButtonActionText={`Add new county to ${kingdomDTO.object?.name}`}
            addExistingButtonActionText={"Link existing county to this kingdom"}
            deleteButtonActionText={`Unlink this county from ${kingdomDTO.object?.name}`}
            subCategoryLinkText={"county"} />
        <SubCategoryBody mainEntryId={kingdomDTO.object?.id!}
            subObjects={kingdomDTO.continents}
            subCategoryTitle={"Continents"} subCategoryLink={"continents"}
            fillTheListWithAllSubObjects={getAllContinets}
            addExistingObjectToRelation={saveExistingContinentToKingdom}
            deleteSubObject={removeContinentFromKingdomFunction}
            addNewSubEntryToRelation={saveNewContinentToKingdom}
            addButtonActionText={`Add new continent to ${kingdomDTO.object?.name}`}
            addExistingButtonActionText={"Link existing continent to this kingdom"}
            deleteButtonActionText={`Unlink this continent from ${kingdomDTO.object?.name}`}
            subCategoryLinkText={"continent"} />
    </OneEntryHeaderLayout>
}