import { Accordion } from "react-bootstrap";
import { EntryDTO, EntryFullDTO } from "../../../services/openapi";
import { FullEntryAccordionBody } from "../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../globalFunctions/RegionHooks";
import '../../styles/masonary.css';
import "../../styles/subObjects.css";
import { BeastFunction } from "./beastFunction";
import { BeastSubObjectsFunction } from "./beastSubObjectFunction";

interface IBeastAccordionBody {
  beast: EntryFullDTO,
  regions?: EntryDTO[]
}




export function BeastAccordionBody(props: Readonly<IBeastAccordionBody>) {

  const { saveImageToBeast, deleteImageFromBeast, addNewDesctiptionToBeast, updateBeastDescription, deleteDescriptionFromBeast } = BeastFunction();
  const { saveNewRegionToBeast, saveExistingRegionToBeast, removeRegionFromBeastFunction } = BeastSubObjectsFunction();
  return (
    <Accordion.Body>
      <FullEntryAccordionBody categoryName={"Beast"} entryFullDTO={props.beast}
      saveImageToEntry={saveImageToBeast}
      deleteImageFromEntry={deleteImageFromBeast} deleteImageButtonActionText={"Delete image"} 
      addNewDescriptionToEntry={addNewDesctiptionToBeast} 
      updateDescription={updateBeastDescription} 
      deleteDescriptionFromEntry={deleteDescriptionFromBeast} />

{/* <SubCategoryBody mainEntryId={props.beast.object?.id!}
        subObjects={props.beast.subObjects}
        subCategoryTitle={"Regions"} subCategoryLink={"regions"}
        fillTheListWithAllSubObjects={getAllRegions}
        addExistingObjectToRelation={saveExistingRegionToBeast}
        deleteSubObject={removeRegionFromBeastFunction}
        addNewSubEntryToRelation={saveNewRegionToBeast}
        addButtonActionText={"Add new region that use this culture"}
        addExistingButtonActionText={"Link existing region from list to this culture"}
        deleteButtonActionText={`Unlink this region from ${props.beast.object?.name}`}
        subCategoryLinkText={"region"} /> */}
    </Accordion.Body>
  )
}