import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { EntryFullDTO, KingdomControllerService } from "../../../../services/openapi";
import { BrowsingListLayout } from "../../../components/accordions/browsingListLayout";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { KingdomFunction } from "./function/kingdomFunction";
import { KingdomFunctionArray } from "./function/kingdomFunctionArrays";
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
    const { getAllCountiesWithoutKingdom,
        saveExistingCountyToKingdom, removeCountyFromKingdomFunction, saveNewCountyToKingdom,
        getAllContinets, saveNewContinentToKingdom, saveExistingContinentToKingdom, removeContinentFromKingdomFunction } = KingdomFunctionSubObjects({ name: props.kingdom!.object!.name! });


    if (props.status === "pending") return <div>Loading...</div>;
    return (<BrowsingListLayout categoryName={"kingdom"} updateEntry={editKingdom}
        deleteEntry={deleteKingdom} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={props.kingdom} fetchFullValue={getFullKingdomDTO} key={props.kingdom.object?.id} mainEntryLink={"politics/kingdom"}>
        {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
        {data &&
            <Accordion.Body>
                <FullEntryAccordionBody categoryName={"Kingdom"} entryFullDTO={{
                    object: data.object,
                    images: data.images,
                    descriptions: data.descriptions
                }}
                    saveImageToEntry={saveImageToKingdom}
                    deleteImageFromEntry={deleteImageFromKingdom}
                    deleteImageButtonActionText={"Delete image"}
                    addNewDescriptionToEntry={addNewDesctiptionToKingdom}
                    updateDescription={updateKingdomDescription}
                    deleteDescriptionFromEntry={deleteDescriptionFromKingdom} />
                <SubCategoryBody mainEntryId={data.object?.id!}
                    subObjects={data.counties}
                    subCategoryTitle={"Counties"} subCategoryLink={"/politics/counties"}
                    fillTheListWithAllSubObjects={getAllCountiesWithoutKingdom}
                    addExistingObjectToRelation={saveExistingCountyToKingdom}
                    deleteSubObject={removeCountyFromKingdomFunction}
                    addNewSubEntryToRelation={saveNewCountyToKingdom}
                    addButtonActionText={`Add new county to ${data.object?.name}`}
                    addExistingButtonActionText={"Link existing county to this kingdom"}
                    deleteButtonActionText={`Unlink this county from ${data.object?.name}`}
                    subCategoryLinkText={"county"} />
                <SubCategoryBody mainEntryId={data.object?.id!}
                    subObjects={data.continents}
                    subCategoryTitle={"Continents"} subCategoryLink={"continents"}
                    fillTheListWithAllSubObjects={getAllContinets}
                    addExistingObjectToRelation={saveExistingContinentToKingdom}
                    deleteSubObject={removeContinentFromKingdomFunction}
                    addNewSubEntryToRelation={saveNewContinentToKingdom}
                    addButtonActionText={`Add new continent to ${data.object?.name}`}
                    addExistingButtonActionText={"Link existing continent to this kingdom"}
                    deleteButtonActionText={`Unlink this continent from ${data.object?.name}`}
                    subCategoryLinkText={"continent"} />
            </Accordion.Body>
        }
    </BrowsingListLayout>
    )
}