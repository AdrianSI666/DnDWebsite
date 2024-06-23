import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";

import { useQuery } from "@tanstack/react-query";
import { KingdomControllerService } from "../../../../../services/openapi";
import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { KingdomFunctionArray } from "../function/kingdomFunctionArrays";
import { KingdomFunctionDomObjects } from "../function/kingdomFunctionDomObjects";
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
    const { getAllRegionsWithoutKingdom, saveExistingRegionToKingdom, saveNewRegionToKingdom, removeRegionFromKingdomFunction } = KingdomFunctionSubObjects({ name: name! })
    const { setNewContinentToKingdom, setExistingContinentToKingdom, removeContinentFromKingdomFunction, getAllContinents } = KingdomFunctionDomObjects({ name: name! });

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Kingdom named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this kingdom"}
        deleteEntry={removeKingdom}
        updateEntry={editKingdom} categoryName={"Kingdom"}
        entryFullDTO={kingdomDTO}>
        <DomCategoryBody categoryName={"Continent"} mainEntryId={kingdomDTO.object?.id!}
            descriptionOfConnectionString={"Continent of"} descriptionOfNullConnectionString={"This kingdom isn't linked to any continent."}
            domObject={kingdomDTO.domObjects}
            domCategoryName={"Continent"} domCategoryLink={"continents"}
            fillTheListWithAllSubObjects={getAllContinents}
            setNewDomEntryToRelation={setNewContinentToKingdom}
            addExistingObjectToRelation={setExistingContinentToKingdom}
            deleteSubObject={removeContinentFromKingdomFunction}
            addButtonActionText={`Set new continent to ${kingdomDTO.object?.name}`}
            deleteButtonActionText={`Unlink this kingdom from continent`}
            addExistingButtonActionText={`Set existing continent to ${kingdomDTO.object?.name}`} />
        <FullEntryAccordionBody categoryName={"Kingdom"} entryFullDTO={kingdomDTO}
            saveImageToEntry={saveImageToKingdom}
            deleteImageFromEntry={deleteImageFromKingdom}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToKingdom}
            updateDescription={updateKingdomDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromKingdom} />
        <SubCategoryBody mainEntryId={kingdomDTO.object?.id!}
            subObjects={kingdomDTO.subObjects}
            subCategoryTitle={"Regions"} subCategoryLink={"regions"}
            fillTheListWithAllSubObjects={getAllRegionsWithoutKingdom}
            addExistingObjectToRelation={saveExistingRegionToKingdom}
            deleteSubObject={removeRegionFromKingdomFunction}
            addNewSubEntryToRelation={saveNewRegionToKingdom}
            addButtonActionText={"Add new region to this kingdom"}
            addExistingButtonActionText={"Link existing region to this kingdom"}
            deleteButtonActionText={`Unlink this region from ${kingdomDTO.object?.name}`}
            subCategoryLinkText={"region"} />
    </OneEntryHeaderLayout>
}