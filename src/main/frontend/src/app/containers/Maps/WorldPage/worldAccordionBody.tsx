import { Accordion } from "react-bootstrap";
import { EntryFullDTO } from "../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { WorldFunction } from "./worldFunction";
import { WorldSubObjectsFunction } from "./worldSubObjectsFunction";

interface IWorldAccordionBody {
  world: EntryFullDTO
}

export function WorldAccordionBody(props: Readonly<IWorldAccordionBody>) {

  const { saveImageToWorld, deleteImageFromWorld, addNewDesctiptionToWorld, updateWorldDescription, deleteDescriptionFromWorld } = WorldFunction();
  const { saveNewPlaneToWorld, saveExistingPlaneToWorld, removePlaneFromWorldFunction, getAllPlanesWithoutWorld } = WorldSubObjectsFunction();


  return (
    <Accordion.Body>
      <FullEntryAccordionBody categoryName={"World"} entryFullDTO={props.world}
        saveImageToEntry={saveImageToWorld}
        deleteImageFromEntry={deleteImageFromWorld}
        deleteImageButtonActionText={"Delete image"}
        addNewDescriptionToEntry={addNewDesctiptionToWorld}
        updateDescription={updateWorldDescription}
        deleteDescriptionFromEntry={deleteDescriptionFromWorld} />
      <SubCategoryBody mainEntryId={props.world.object?.id!}
        subObjects={props.world.subObjects}
        subCategoryTitle={"Planes"} subCategoryLink={"planes"}
        fillTheListWithAllSubObjects={getAllPlanesWithoutWorld}
        addExistingObjectToRelation={saveExistingPlaneToWorld}
        deleteSubObject={removePlaneFromWorldFunction}
        addNewSubEntryToRelation={saveNewPlaneToWorld}
        addButtonActionText={`Add new plane that exist on ${props.world.object?.name}`}
        addExistingButtonActionText={"Link existing plane to this World"}
        deleteButtonActionText={`Unlink this plane from ${props.world.object?.name}`}
        subCategoryLinkText={"plane"} />
    </Accordion.Body>
  )
}