import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { EntryFullDTO, CountyControllerService } from "../../../../services/openapi";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { CountyFunction } from "./function/countyFunction";
import { CountyFunctionArray } from "./function/countyFunctionArrays";
import { CountyFunctionDomObjects } from "./function/countyFunctionDomObjects";
import { CountyFunctionSubObjects } from "./function/countyFunctionSubObjects";

interface ICountyAccordionBody {
    county: EntryFullDTO,
    pageNumber: number,
    pageSize: number,
    status: string
}

export function CountyAccordion(props: Readonly<ICountyAccordionBody>) {
    const [name, setName] = useState<string | undefined>();

    const { status, data } = useQuery({
        queryKey: ["county", name],
        queryFn: async () => CountyControllerService.getCountyByName(name!),
        enabled: !!name,
    })

    const getFullCountyDTO = async (name: string) => {
        setName(name);
    }

    const { editCounty, deleteCounty } = CountyFunction({ pageNumber: props.pageNumber, pageSize: props.pageSize, resetFullCountyDTO: getFullCountyDTO })
    const { saveImageToCounty, deleteImageFromCounty, addNewDesctiptionToCounty, updateCountyDescription, deleteDescriptionFromCounty } = CountyFunctionArray({ name: props.county!.object!.name! });
    const { getAllRegionsWithoutCounty,
        saveExistingRegionToCounty, removeRegionFromCountyFunction, saveNewRegionToCounty } = CountyFunctionSubObjects({ name: props.county!.object!.name! });
    const { setNewKingdomToCounty, setExistingKingdomToCounty, removeKingdomFromCountyFunction, getAllKingdoms } = CountyFunctionDomObjects({ name: props.county!.object!.name! });


    if (props.status === "pending") return <div>Loading...</div>;
    return (<AccordionHeaderLayout categoryName={"county"} updateEntry={editCounty}
        deleteEntry={deleteCounty} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={props.county} fetchFullValue={getFullCountyDTO} key={props.county.object?.id} mainEntryLink={"politics/county"}>
        {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
        {data &&
            <Accordion.Body>
                <DomCategoryBody categoryName={"County"} mainEntryId={data.object?.id!}
                    descriptionOfConnectionString={"Kingdom of"} descriptionOfNullConnectionString={"This county isn't linked to any kingdom."}
                    domObject={data.domObjects}
                    domCategoryName={"Kingdom"} domCategoryLink={"politics/kingdoms"}
                    fillTheListWithAllSubObjects={getAllKingdoms}
                    setNewDomEntryToRelation={setNewKingdomToCounty}
                    addExistingObjectToRelation={setExistingKingdomToCounty}
                    deleteSubObject={removeKingdomFromCountyFunction}
                    addButtonActionText={`Set new kingdom to ${data.object?.name}`}
                    deleteButtonActionText={`Unlink this county from kingdom`}
                    addExistingButtonActionText={`Set existing kingdom to ${data.object?.name}`} />
                <FullEntryAccordionBody categoryName={"County"} entryFullDTO={{
                    object:data.object,
                    images:data.images,
                    descriptions:data.descriptions
                }}
                    saveImageToEntry={saveImageToCounty}
                    deleteImageFromEntry={deleteImageFromCounty}
                    deleteImageButtonActionText={"Delete image"}
                    addNewDescriptionToEntry={addNewDesctiptionToCounty}
                    updateDescription={updateCountyDescription}
                    deleteDescriptionFromEntry={deleteDescriptionFromCounty} />
                <SubCategoryBody mainEntryId={data.object?.id!}
                    subObjects={data.subObjects}
                    subCategoryTitle={"Regions"} subCategoryLink={"/politics/regions"}
                    fillTheListWithAllSubObjects={getAllRegionsWithoutCounty}
                    addExistingObjectToRelation={saveExistingRegionToCounty}
                    deleteSubObject={removeRegionFromCountyFunction}
                    addNewSubEntryToRelation={saveNewRegionToCounty}
                    addButtonActionText={`Add new region to ${data.object?.name}`}
                    addExistingButtonActionText={"Link existing region to this county"}
                    deleteButtonActionText={`Unlink this region from ${data.object?.name}`}
                    subCategoryLinkText={"region"} />
            </Accordion.Body>
        }
    </AccordionHeaderLayout>
    )
}