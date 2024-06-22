import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { ContinentControllerService, EntryFullDTO } from "../../../../services/openapi";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { ContinentFunction } from "./continentFunction";
import { ContinentFunctionArray } from "./continentFunctionArrays";
import { ContinentFunctionSubObjects } from "./continentFunctionSubObjects";
import { ContinentFunctionDomObjects } from "./continentFunctionDomObjects";

interface IContinentAccordionBody {
    continent: EntryFullDTO,
    pageNumber: number,
    pageSize: number,
    status: string
}

export function ContinentAccordion(props: Readonly<IContinentAccordionBody>) {
    const [name, setName] = useState<string | undefined>();

    const { status, data } = useQuery({
        queryKey: ["continent", name],
        queryFn: async () => ContinentControllerService.getContinentByName(name!),
        enabled: !!name,
    })

    const getFullContinentDTO = async (name: string) => {
        setName(name);
    }

    const { editContinent, deleteContinent } = ContinentFunction({ pageNumber: props.pageNumber, pageSize: props.pageSize, resetFullContinentDTO: getFullContinentDTO })
    const { saveImageToContinent, deleteImageFromContinent, addNewDesctiptionToContinent, updateContinentDescription, deleteDescriptionFromContinent } = ContinentFunctionArray({ name: props.continent!.object!.name! });
    const { getAllKingdomsWithoutContinent,
        saveExistingKingdomToContinent, removeKingdomFromContinentFunction, saveNewKingdomToContinent } = ContinentFunctionSubObjects({ name: props.continent!.object!.name! });
    const { setNewPlaneToContinent, setExistingPlaneToContinent, removePlaneFromContinentFunction, getAllPlanes } = ContinentFunctionDomObjects({ name: props.continent!.object!.name! });


    if (props.status === "pending") return <div>Loading...</div>;
    return (<AccordionHeaderLayout categoryName={"continent"} updateEntry={editContinent}
        deleteEntry={deleteContinent} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={props.continent} fetchFullValue={getFullContinentDTO} key={props.continent.object?.id}>
        {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
        {data && <Accordion.Body>
            <DomCategoryBody categoryName={"Continent"} mainEntryId={data.object?.id!}
                descriptionOfConnectionString={"Plane of"} descriptionOfNullConnectionString={"This continent isn't linked to any plane."}
                domObject={data.domObjects}
                domCategoryName={"Plane"} domCategoryLink={"planes"}
                fillTheListWithAllSubObjects={getAllPlanes}
                setNewDomEntryToRelation={setNewPlaneToContinent}
                addExistingObjectToRelation={setExistingPlaneToContinent}
                deleteSubObject={removePlaneFromContinentFunction}
                addButtonActionText={`Set new plane to ${data.object?.name}`}
                deleteButtonActionText={`Unlink this continent from plane`}
                addExistingButtonActionText={`Set existing plane to ${data.object?.name}`} />
            <FullEntryAccordionBody categoryName={"Continent"} entryFullDTO={data}
                saveImageToEntry={saveImageToContinent}
                deleteImageFromEntry={deleteImageFromContinent}
                deleteImageButtonActionText={"Delete image"}
                addNewDescriptionToEntry={addNewDesctiptionToContinent}
                updateDescription={updateContinentDescription}
                deleteDescriptionFromEntry={deleteDescriptionFromContinent} />
            <SubCategoryBody mainEntryId={data.object?.id!}
                subObjects={data.subObjects}
                subCategoryTitle={"Kingdoms"} subCategoryLink={"kingdoms"}
                fillTheListWithAllSubObjects={getAllKingdomsWithoutContinent}
                addExistingObjectToRelation={saveExistingKingdomToContinent}
                deleteSubObject={removeKingdomFromContinentFunction}
                addNewSubEntryToRelation={saveNewKingdomToContinent}
                addButtonActionText={`Add new kingdom to ${data.object?.name}`}
                addExistingButtonActionText={"Link existing kingdom to this continent"}
                deleteButtonActionText={`Unlink this kingdom from ${data.object?.name}`}
                subCategoryLinkText={"kingdom"} />
        </Accordion.Body>
        }
    </AccordionHeaderLayout>
    )
}