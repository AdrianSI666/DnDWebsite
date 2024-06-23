import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { EntryFullDTO, KingdomControllerService } from "../../../../services/openapi";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { KingdomFunction } from "./function/kingdomFunction";
import { KingdomFunctionArray } from "./function/kingdomFunctionArrays";
import { KingdomFunctionDomObjects } from "./function/kingdomFunctionDomObjects";
import { KingdomFunctionSubObjects } from "./function/kingdomFunctionSubObjects";

interface IKingdomAccordionBody {
    kingdom: EntryFullDTO,
    pageNumber: number,
    pageSize: number,
    status: string
}

export function KingdomAccordion(props: Readonly<IKingdomAccordionBody>) {
    const [name, setName] = useState<string | undefined>();

    const { status, data } = useQuery({
        queryKey: ["kingdom", name],
        queryFn: async () => KingdomControllerService.getKingdomByName(name!),
        enabled: !!name,
    })

    const getFullKingdomDTO = async (name: string) => {
        setName(name);
    }

    const { editKingdom, deleteKingdom } = KingdomFunction({ pageNumber: props.pageNumber, pageSize: props.pageSize, resetFullKingdomDTO: getFullKingdomDTO })
    const { saveImageToKingdom, deleteImageFromKingdom, addNewDesctiptionToKingdom, updateKingdomDescription, deleteDescriptionFromKingdom } = KingdomFunctionArray({ name: props.kingdom!.object!.name! });
    const { getAllRegionsWithoutKingdom,
        saveExistingRegionToKingdom, removeRegionFromKingdomFunction, saveNewRegionToKingdom } = KingdomFunctionSubObjects({ name: props.kingdom!.object!.name! });
    const { setNewContinentToKingdom, setExistingContinentToKingdom, removeContinentFromKingdomFunction, getAllContinents } = KingdomFunctionDomObjects({ name: props.kingdom!.object!.name! });


    if (props.status === "pending") return <div>Loading...</div>;
    return (<AccordionHeaderLayout categoryName={"kingdom"} updateEntry={editKingdom}
        deleteEntry={deleteKingdom} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={props.kingdom} fetchFullValue={getFullKingdomDTO} key={props.kingdom.object?.id}>
        {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
        {data &&
            <Accordion.Body>
                <DomCategoryBody categoryName={"Kingdom"} mainEntryId={data.object?.id!}
                    descriptionOfConnectionString={"Continent of"} descriptionOfNullConnectionString={"This kingdom isn't linked to any continent."}
                    domObject={data.domObjects}
                    domCategoryName={"Continent"} domCategoryLink={"continents"}
                    fillTheListWithAllSubObjects={getAllContinents}
                    setNewDomEntryToRelation={setNewContinentToKingdom}
                    addExistingObjectToRelation={setExistingContinentToKingdom}
                    deleteSubObject={removeContinentFromKingdomFunction}
                    addButtonActionText={`Set new continent to ${data.object?.name}`}
                    deleteButtonActionText={`Unlink this kingdom from continent`}
                    addExistingButtonActionText={`Set existing continent to ${data.object?.name}`} />
                <FullEntryAccordionBody categoryName={"Kingdom"} entryFullDTO={data}
                    saveImageToEntry={saveImageToKingdom}
                    deleteImageFromEntry={deleteImageFromKingdom}
                    deleteImageButtonActionText={"Delete image"}
                    addNewDescriptionToEntry={addNewDesctiptionToKingdom}
                    updateDescription={updateKingdomDescription}
                    deleteDescriptionFromEntry={deleteDescriptionFromKingdom} />
                <SubCategoryBody mainEntryId={data.object?.id!}
                    subObjects={data.subObjects}
                    subCategoryTitle={"Regions"} subCategoryLink={"regions"}
                    fillTheListWithAllSubObjects={getAllRegionsWithoutKingdom}
                    addExistingObjectToRelation={saveExistingRegionToKingdom}
                    deleteSubObject={removeRegionFromKingdomFunction}
                    addNewSubEntryToRelation={saveNewRegionToKingdom}
                    addButtonActionText={`Add new region to ${data.object?.name}`}
                    addExistingButtonActionText={"Link existing region to this kingdom"}
                    deleteButtonActionText={`Unlink this region from ${data.object?.name}`}
                    subCategoryLinkText={"region"} />
            </Accordion.Body>
        }
    </AccordionHeaderLayout>
    )
}