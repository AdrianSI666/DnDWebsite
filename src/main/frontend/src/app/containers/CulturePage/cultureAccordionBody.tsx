import { Accordion } from "react-bootstrap";
import { EntryFullDTO } from "../../../services/openapi";
import { FullEntryAccordionBody } from "../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../hookFunctions/RegionHooks";
import '../../styles/masonary.css';
import "../../styles/subObjects.css";
import { CultureFunction } from "./cultureFunction";
import { CultureSubObjectsFunction } from "./cultureSubObjectsFunction";

interface ICultureAccordionBody {
  culture: EntryFullDTO
}

export function CultureAccordionBody(props: Readonly<ICultureAccordionBody>) {

  const { deleteCulture, editCulture, saveImageToCulture, deleteImageFromCulture } = CultureFunction({ cultureId: props.culture.object?.id });
  const { saveNewRegionToCulture, saveExistingRegionToCulture, removeRegionFromCultureFunction } = CultureSubObjectsFunction();


  return (
    <Accordion.Body>
      <FullEntryAccordionBody categoryName={"culture"} entryFullDTO={props.culture}
        deleteEntry={deleteCulture}
        updateEntry={editCulture}
        saveImageToEntry={saveImageToCulture}
        deleteImageFromEntry={deleteImageFromCulture}
        deleteMainObjectButtonActionText={"Delete this culture"}
        deleteImageButtonActionText={"Delete image"} />
      <SubCategoryBody mainEntryId={props.culture.object?.id!}
        subObjects={props.culture.subObjects}
        subCategoryTitle={"Regions"} subCategoryLink={"regions"}
        fillTheListWithAllSubObjects={getAllRegions}
        addExistingObjectToRelation={saveExistingRegionToCulture}
        deleteSubObject={removeRegionFromCultureFunction}
        addNewSubEntryToRelation={saveNewRegionToCulture}
        addButtonActionText={"Add new region that use this culture"}
        addExistingButtonActionText={"Link existing region from list to this culture"} 
        deleteButtonActionText={`Unlink this region from ${props.culture.object?.name}`}
        subCategoryLinkText={"region"} />
    </Accordion.Body>
  )
}