import { Accordion } from "react-bootstrap";
import { EntryFullDTO, PlaneControllerService } from "../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { PlaneFunction } from "./planeFunction";
import { PlaneFunctionSubObjects } from "./planeFunctionSubObjects";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { PlaneFunctionArray } from "./planeFunctionArrays";
// import { PlaneFunctionDomObjects } from "./planeFunctionDomObjects";

interface IPlaneAccordion {
    plane: EntryFullDTO,
    pageNumber: number,
    pageSize: number,
    status: string
}

export function PlaneAccordion(props: Readonly<IPlaneAccordion>) {
    const [name, setName] = useState<string | undefined>();

    const { status, data } = useQuery({
        queryKey: ["plane", name],
        queryFn: async () => PlaneControllerService.getPlaneByName(name!),
        enabled: !!name,
    })

    const getFullPlaneDTO = async (name: string) => {
        setName(name);
    }

    const { editPlane, deletePlane } = PlaneFunction({ pageNumber: props.pageNumber, pageSize: props.pageSize, resetFullPlaneDTO: getFullPlaneDTO })
    const { saveImageToPlane, deleteImageFromPlane, addNewDesctiptionToPlane, updatePlaneDescription, deleteDescriptionFromPlane } = PlaneFunctionArray({ name: props.plane!.object!.name! });
    const { getAllContinentsWithoutPlane,
        saveExistingContinentToPlane, removeContinentFromPlaneFunction, saveNewContinentToPlane,
        getAllCreatureTypes, removeCreatureTypeFromPlaneFunction, saveNewCreatureTypeToPlane, saveExistingCreatureTypeToPlane } = PlaneFunctionSubObjects({ name: props.plane!.object!.name! });
    // const { setNewWorldToPlane, setExistingWorldToPlane, getAllWorlds } = PlaneFunctionDomObjects({ name: props.plane!.object!.name! });


    if (props.status === "pending") return <div>Loading...</div>;
    return (<AccordionHeaderLayout categoryName={"plane"} updateEntry={editPlane}
    deleteEntry={deletePlane} deleteMainObjectButtonActionText={"Delete"}
    entryFullDTO={props.plane} fetchFullValue={getFullPlaneDTO} key={props.plane.object?.id} mainEntryLink={"geography/planes"}>
        {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
        {data &&
            <Accordion.Body>
                {/* <DomCategoryBody categoryName={"Plane"} mainEntryId={data.object?.id!}
                    descriptionOfConnectionString={"Plane of"} descriptionOfNullConnectionString={"This plane isn't linked to any world."}
                    domObject={data.domObjects}
                    domCategoryName={"World"} domCategoryLink={"worlds"}
                    fillTheListWithAllSubObjects={getAllWorlds}
                    setNewDomEntryToRelation={setNewWorldToPlane}
                    addExistingObjectToRelation={setExistingWorldToPlane}
                    deleteSubObject={removeWorldFromPlaneFunction}
                    addButtonActionText={`Set new world to ${data.object?.name}`}
                    deleteButtonActionText={`Unlink this plane from world`}
                    addExistingButtonActionText={`Set existing world to ${data.object?.name}`} /> */}
                <FullEntryAccordionBody categoryName={"Plane"} entryFullDTO={{
                    object: data.plane,
                    images: data.images,
                    descriptions: data.descriptions
                }}
                    saveImageToEntry={saveImageToPlane}
                    deleteImageFromEntry={deleteImageFromPlane}
                    deleteImageButtonActionText={"Delete image"}
                    addNewDescriptionToEntry={addNewDesctiptionToPlane}
                    updateDescription={updatePlaneDescription}
                    deleteDescriptionFromEntry={deleteDescriptionFromPlane} />
                <SubCategoryBody mainEntryId={data.plane?.id!}
                    subObjects={data.continents}
                    subCategoryTitle={"Continents"} subCategoryLink={"geography/continents"}
                    fillTheListWithAllSubObjects={getAllContinentsWithoutPlane}
                    addExistingObjectToRelation={saveExistingContinentToPlane}
                    deleteSubObject={removeContinentFromPlaneFunction}
                    addNewSubEntryToRelation={saveNewContinentToPlane}
                    addButtonActionText={`Add new continent to ${data.plane?.name}`}
                    addExistingButtonActionText={"Link existing Continent to this plane"}
                    deleteButtonActionText={`Unlink this continent from ${data.plane?.name}`}
                    subCategoryLinkText={"continent"} />
                <SubCategoryBody mainEntryId={data.plane?.id!}
                    subObjects={data.creatureTypes}
                    subCategoryTitle={"Creature types"} subCategoryLink={"creatures/types"}
                    fillTheListWithAllSubObjects={getAllCreatureTypes}
                    addExistingObjectToRelation={saveExistingCreatureTypeToPlane}
                    deleteSubObject={removeCreatureTypeFromPlaneFunction}
                    addNewSubEntryToRelation={saveNewCreatureTypeToPlane}
                    addButtonActionText={`Add new creature type to ${data.plane?.name}`}
                    addExistingButtonActionText={"Link existing creature type to this plane"}
                    deleteButtonActionText={`Unlink this creature type from ${data.plane?.name}`}
                    subCategoryLinkText={"creature type"} />
            </Accordion.Body>
        }
    </AccordionHeaderLayout>
    )
}