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
    const { getAllKingdoms,
        saveExistingKingdomToContinent, removeKingdomFromContinentFunction, saveNewKingdomToContinent,
        getAllRegions,
        removeRegionFromContinentFunction, saveNewRegionToContinent, saveExistingRegionToContinent } = ContinentFunctionSubObjects({ name: props.continent!.object!.name! });
    const { setNewPlaneToContinent, setExistingPlaneToContinent, removePlaneFromContinentFunction, getAllPlanes } = ContinentFunctionDomObjects({ name: props.continent!.object!.name! });


    if (props.status === "pending") return <div>Loading...</div>;
    return (<AccordionHeaderLayout categoryName={"continent"} updateEntry={editContinent}
        deleteEntry={deleteContinent} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={props.continent} fetchFullValue={getFullContinentDTO} key={props.continent.object?.id} mainEntryLink={"geography/continents"}>
        {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
        {data && <Accordion.Body>
            <DomCategoryBody categoryName={"Continent"} mainEntryId={data.continent?.id!}
                descriptionOfConnectionString={"Plane of"} descriptionOfNullConnectionString={"This continent isn't linked to any plane."}
                domObject={data.plane}
                domCategoryName={"Plane"} domCategoryLink={"geography/planes"}
                fillTheListWithAllSubObjects={getAllPlanes}
                setNewDomEntryToRelation={setNewPlaneToContinent}
                addExistingObjectToRelation={setExistingPlaneToContinent}
                deleteSubObject={removePlaneFromContinentFunction}
                addButtonActionText={`Set new plane to ${data.continent?.name}`}
                deleteButtonActionText={`Unlink this continent from plane`}
                addExistingButtonActionText={`Set existing plane to ${data.continent?.name}`} />
            <FullEntryAccordionBody categoryName={"Continent"} entryFullDTO={{
                object: data.continent,
                images: data.images,
                descriptions: data.descriptions
            }}
                saveImageToEntry={saveImageToContinent}
                deleteImageFromEntry={deleteImageFromContinent}
                deleteImageButtonActionText={"Delete image"}
                addNewDescriptionToEntry={addNewDesctiptionToContinent}
                updateDescription={updateContinentDescription}
                deleteDescriptionFromEntry={deleteDescriptionFromContinent} />
            <SubCategoryBody mainEntryId={data.continent?.id!}
                subObjects={data.regions}
                subCategoryTitle={"Regions"} subCategoryLink={"geography/regions"}
                fillTheListWithAllSubObjects={getAllRegions}
                addExistingObjectToRelation={saveExistingRegionToContinent}
                deleteSubObject={removeRegionFromContinentFunction}
                addNewSubEntryToRelation={saveNewRegionToContinent}
                addButtonActionText={`Add new region to ${data.continent?.name}`}
                addExistingButtonActionText={"Link existing region to this continent"}
                deleteButtonActionText={`Unlink this region from ${data.continent?.name}`}
                subCategoryLinkText={"region"} />
            <SubCategoryBody mainEntryId={data.continent?.id!}
                subObjects={data.kingdoms}
                subCategoryTitle={"Kingdoms"} subCategoryLink={"politics/kingdoms"}
                fillTheListWithAllSubObjects={getAllKingdoms}
                addExistingObjectToRelation={saveExistingKingdomToContinent}
                deleteSubObject={removeKingdomFromContinentFunction}
                addNewSubEntryToRelation={saveNewKingdomToContinent}
                addButtonActionText={`Add new kingdom to ${data.continent?.name}`}
                addExistingButtonActionText={"Link existing kingdom to this continent"}
                deleteButtonActionText={`Unlink this kingdom from ${data.continent?.name}`}
                subCategoryLinkText={"politics/kingdoms"} />
        </Accordion.Body>
        }
    </AccordionHeaderLayout>
    )
}