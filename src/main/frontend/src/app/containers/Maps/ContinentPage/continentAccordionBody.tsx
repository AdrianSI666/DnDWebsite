import { Accordion } from "react-bootstrap";
import { EntryFullDTO } from "../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { ContinentFunction } from "./continentFunction";
import { ContinentSubObjectsFunction } from "./continentSubObjectsFunction";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { ContinentDomObjectsFunction } from "./continentDomObjectsFunction";

interface IContinentAccordionBody {
    continent: EntryFullDTO
}

export function ContinentAccordionBody(props: Readonly<IContinentAccordionBody>) {

    const { deleteContinent, editContinent, saveImageToContinent, deleteImageFromContinent } = ContinentFunction({ continentId: props.continent.object?.id });
    const { saveNewKingdomToContinent, saveExistingKingdomToContinent, removeKingdomFromContinentFunction, getAllKingdomsWithoutContinent } = ContinentSubObjectsFunction();
    const { setNewPlaneToContinent, setExistingPlaneToContinent, removePlaneFromContinentFunction, getAllPlanes } = ContinentDomObjectsFunction();

    return (
        <Accordion.Body>
            <DomCategoryBody categoryName={"Continent"} mainEntryId={props.continent.object?.id!}
                descriptionOfConnectionString={"Plane of"} descriptionOfNullConnectionString={"This continent isn't linked to any plane."}
                domObject={props.continent.domObjects}
                domCategoryName={"Plane"} domCategoryLink={"planes"}
                fillTheListWithAllSubObjects={getAllPlanes}
                setNewDomEntryToRelation={setNewPlaneToContinent}
                addExistingObjectToRelation={setExistingPlaneToContinent}
                deleteSubObject={removePlaneFromContinentFunction}
                addButtonActionText={`Set new plane to ${props.continent.object?.name}`}
                deleteButtonActionText={`Unlink this continent from plane`}
                addExistingButtonActionText={`Set existing plane to ${props.continent.object?.name}`} />
            <FullEntryAccordionBody categoryName={"Continent"} entryFullDTO={props.continent}
                deleteEntry={deleteContinent}
                updateEntry={editContinent}
                saveImageToEntry={saveImageToContinent}
                deleteImageFromEntry={deleteImageFromContinent}
                deleteMainObjectButtonActionText={"Delete this continent"}
                deleteImageButtonActionText={"Delete image"} />
            <SubCategoryBody mainEntryId={props.continent.object?.id!}
                subObjects={props.continent.subObjects}
                subCategoryTitle={"Kingdoms"} subCategoryLink={"kingdoms"}
                fillTheListWithAllSubObjects={getAllKingdomsWithoutContinent}
                addExistingObjectToRelation={saveExistingKingdomToContinent}
                deleteSubObject={removeKingdomFromContinentFunction}
                addNewSubEntryToRelation={saveNewKingdomToContinent}
                addButtonActionText={`Add new kingdom to ${props.continent.object?.name}`}
                addExistingButtonActionText={"Link existing kingdom to this continent"}
                deleteButtonActionText={`Unlink this kingdom from ${props.continent.object?.name}`}
                subCategoryLinkText={"kingdom"} />
        </Accordion.Body>
    )
}