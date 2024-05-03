import { Accordion } from "react-bootstrap";
import { EntryFullDTO } from "../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { PlaneFunction } from "./planeFunction";
import { PlaneSubObjectsFunction } from "./planeSubObjectsFunction";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { PlaneDomObjectsFunction } from "./planeDomObjectsFunction";

interface IPlaneAccordionBody {
    plane: EntryFullDTO
}

export function PlaneAccordionBody(props: Readonly<IPlaneAccordionBody>) {

    const { deletePlane, editPlane, saveImageToPlane, deleteImageFromPlane } = PlaneFunction({ planeId: props.plane.object?.id });
    const { saveNewContinentToPlane, saveExistingContinentToPlane, removeContinentFromPlaneFunction, getAllContinentsWithoutPlane } = PlaneSubObjectsFunction();
    const { setNewWorldToPlane, setExistingWorldToPlane, removeWorldFromPlaneFunction, getAllWorlds } = PlaneDomObjectsFunction();

    return (
        <Accordion.Body>
            <DomCategoryBody categoryName={"Plane"} mainEntryId={props.plane.object?.id!}
                descriptionOfConnectionString={"World of"} descriptionOfNullConnectionString={"This plane isn't linked to any world."}
                domObject={props.plane.domObjects}
                domCategoryName={"World"} domCategoryLink={"worlds"}
                fillTheListWithAllSubObjects={getAllWorlds}
                setNewDomEntryToRelation={setNewWorldToPlane}
                addExistingObjectToRelation={setExistingWorldToPlane}
                deleteSubObject={removeWorldFromPlaneFunction}
                addButtonActionText={`Set new world to ${props.plane.object?.name}`}
                deleteButtonActionText={`Unlink this plane from world`}
                addExistingButtonActionText={`Set existing world to ${props.plane.object?.name}`} />
            <FullEntryAccordionBody categoryName={"Plane"} entryFullDTO={props.plane}
                deleteEntry={deletePlane}
                updateEntry={editPlane}
                saveImageToEntry={saveImageToPlane}
                deleteImageFromEntry={deleteImageFromPlane}
                deleteMainObjectButtonActionText={"Delete this plane"}
                deleteImageButtonActionText={"Delete image"} />
            <SubCategoryBody mainEntryId={props.plane.object?.id!}
                subObjects={props.plane.subObjects}
                subCategoryTitle={"Continents"} subCategoryLink={"continents"}
                fillTheListWithAllSubObjects={getAllContinentsWithoutPlane}
                addExistingObjectToRelation={saveExistingContinentToPlane}
                deleteSubObject={removeContinentFromPlaneFunction}
                addNewSubEntryToRelation={saveNewContinentToPlane}
                addButtonActionText={`Add new continent to ${props.plane.object?.name}`}
                addExistingButtonActionText={"Link existing Continent to this plane"}
                deleteButtonActionText={`Unlink this continent from ${props.plane.object?.name}`}
                subCategoryLinkText={"continent"} />
        </Accordion.Body>
    )
}