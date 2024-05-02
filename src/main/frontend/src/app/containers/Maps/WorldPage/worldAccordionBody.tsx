import { Accordion } from "react-bootstrap";
import { EntryFullDTO } from "../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
//import { getAllPlanes } from "../../../hookFunctions/PlaneHooks";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { WorldFunction } from "./worldFunction";
import { WorldSubObjectsFunction } from "./worldSubObjectsFunction";

interface IWorldAccordionBody {
  world: EntryFullDTO
}

export function WorldAccordionBody(props: Readonly<IWorldAccordionBody>) {

  const { deleteWorld, editWorld, saveImageToWorld, deleteImageFromWorld } = WorldFunction({ worldId: props.world.object?.id });
  const { saveNewPlaneToWorld, saveExistingPlaneToWorld, removePlaneFromWorldFunction } = WorldSubObjectsFunction();


  return (
    <Accordion.Body>
      <FullEntryAccordionBody categoryName={"World"} entryFullDTO={props.world}
        deleteEntry={deleteWorld}
        updateEntry={editWorld}
        saveImageToEntry={saveImageToWorld}
        deleteImageFromEntry={deleteImageFromWorld}
        deleteMainObjectButtonActionText={"Delete this world"}
        deleteImageButtonActionText={"Delete image"} />
      <SubCategoryBody mainEntryId={props.world.object?.id!}
        subObjects={props.world.subObjects}
        subCategoryTitle={"Planes"} subCategoryLink={"Planes"}
        fillTheListWithAllSubObjects={getAllPlanes}
        addExistingObjectToRelation={saveExistingPlaneToWorld}
        deleteSubObject={removePlaneFromWorldFunction}
        addNewSubEntryToRelation={saveNewPlaneToWorld}
        addButtonActionText={"Add new Plane that use this World"}
        addExistingButtonActionText={"Link existing plane from list to this World"} 
        deleteButtonActionText={`Unlink this plane from ${props.world.object?.name}`}
        subCategoryLinkText={"plane"} />
    </Accordion.Body>
  )
}