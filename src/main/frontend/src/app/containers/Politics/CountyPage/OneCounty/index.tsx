import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";

import { useQuery } from "@tanstack/react-query";
import { CountyControllerService } from "../../../../../services/openapi";
import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { CountyFunctionArray } from "../function/countyFunctionArrays";
import { CountyFunctionDomObjects } from "../function/countyFunctionDomObjects";
import { CountyFunctionSubObjects } from "../function/countyFunctionSubObjects";
import { UseOneCountyFunction } from "./useOneKingdomFunction";

export function OneCounty() {
    let { name } = useParams();
    const { status, data: countyDTO, error } = useQuery({
        queryKey: ["county", name],
        queryFn: async () => CountyControllerService.getCountyByName(name!)
    })

    const { removeCounty, editCounty } = UseOneCountyFunction({ name: name! });
    const { saveImageToCounty, deleteImageFromCounty,
        addNewDesctiptionToCounty, updateCountyDescription, deleteDescriptionFromCounty } = CountyFunctionArray({ name: name! })
    const { getAllRegionsWithoutCounty, saveExistingRegionToCounty, saveNewRegionToCounty, removeRegionFromCountyFunction } = CountyFunctionSubObjects({ name: name! })
    const { setNewKingdomToCounty, setExistingKingdomToCounty, removeKingdomFromCountyFunction, getAllKingdoms } = CountyFunctionDomObjects({ name: name! });

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>County named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this county"}
        deleteEntry={removeCounty}
        updateEntry={editCounty} categoryName={"County"}
        entryFullDTO={{
            object: countyDTO.object,
            images: countyDTO.images,
            descriptions: countyDTO.descriptions
        }}>
        <DomCategoryBody categoryName={"County"} mainEntryId={countyDTO.object?.id!}
            descriptionOfConnectionString={"Kingdom of"} descriptionOfNullConnectionString={"This county isn't linked to any kingdom."}
            domObject={countyDTO.domObjects}
            domCategoryName={"Kingdom"} domCategoryLink={"kingdoms"}
            fillTheListWithAllSubObjects={getAllKingdoms}
            setNewDomEntryToRelation={setNewKingdomToCounty}
            addExistingObjectToRelation={setExistingKingdomToCounty}
            deleteSubObject={removeKingdomFromCountyFunction}
            addButtonActionText={`Set new kingdom to ${countyDTO.object?.name}`}
            deleteButtonActionText={`Unlink this county from kingdom`}
            addExistingButtonActionText={`Set existing kingdom to ${countyDTO.object?.name}`} />
        <FullEntryAccordionBody categoryName={"County"} entryFullDTO={{
            object: countyDTO.object,
            images: countyDTO.images,
            descriptions: countyDTO.descriptions
        }}
            saveImageToEntry={saveImageToCounty}
            deleteImageFromEntry={deleteImageFromCounty}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToCounty}
            updateDescription={updateCountyDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromCounty} />
        <SubCategoryBody mainEntryId={countyDTO.object?.id!}
            subObjects={countyDTO.subObjects}
            subCategoryTitle={"Regions"} subCategoryLink={"regions"}
            fillTheListWithAllSubObjects={getAllRegionsWithoutCounty}
            addExistingObjectToRelation={saveExistingRegionToCounty}
            deleteSubObject={removeRegionFromCountyFunction}
            addNewSubEntryToRelation={saveNewRegionToCounty}
            addButtonActionText={"Add new region to this county"}
            addExistingButtonActionText={"Link existing region to this county"}
            deleteButtonActionText={`Unlink this region from ${countyDTO.object?.name}`}
            subCategoryLinkText={"region"} />
    </OneEntryHeaderLayout>
}