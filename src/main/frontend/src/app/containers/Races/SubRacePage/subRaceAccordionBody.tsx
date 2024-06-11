import { Accordion } from "react-bootstrap";
import { EntryFullDTO } from "../../../../services/openapi";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../globalFunctions/RegionHooks";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { SubRaceFunction } from "./subRaceFunction";
import { SubRaceSubObjectsFunction } from "./subRaceSubObjectsFunction";
import { SubRaceDomObjectsFunction } from "./subRaceDomObjectsFunction";

interface ISubRaceAccordionBody {
    subRace: EntryFullDTO
}


export function SubRaceAccordionBody(props: Readonly<ISubRaceAccordionBody>) {
    const { saveImageToSubRace, deleteImageFromSubRace, addNewDesctiptionToSubRace, deleteDescriptionFromSubRace, updateSubRaceDescription } = SubRaceFunction();
    const { saveNewRegionToSubRace, saveExistingRegionToSubRace, removeRegionFromSubRaceFunction } = SubRaceSubObjectsFunction();
    const { setNewRaceToSubRace, setExistingRaceToSubRace, removeRaceFromSubRaceFunction, getAllRaces } = SubRaceDomObjectsFunction();
    return (
        <Accordion.Body>
            <DomCategoryBody categoryName={"SubRace"} mainEntryId={props.subRace.object?.id!}
                descriptionOfConnectionString={"Sub race of"} descriptionOfNullConnectionString={"This sub race doesn't have main race."}
                domObject={props.subRace.domObjects}
                domCategoryName={"Race"} domCategoryLink={"races"}
                fillTheListWithAllSubObjects={getAllRaces}
                setNewDomEntryToRelation={setNewRaceToSubRace}
                addExistingObjectToRelation={setExistingRaceToSubRace}
                deleteSubObject={removeRaceFromSubRaceFunction}
                addButtonActionText={`Set new core race of ${props.subRace.object?.name}`}
                deleteButtonActionText={`Unset core race of ${props.subRace.object?.name}`}
                addExistingButtonActionText={`Set core race for ${props.subRace.object?.name} from list`} />
            <FullEntryAccordionBody categoryName={"SubRace"} entryFullDTO={props.subRace}
                saveImageToEntry={saveImageToSubRace}
                deleteImageFromEntry={deleteImageFromSubRace}
                deleteImageButtonActionText={"Delete image"}
                addNewDescriptionToEntry={addNewDesctiptionToSubRace}
                updateDescription={updateSubRaceDescription}
                deleteDescriptionFromEntry={deleteDescriptionFromSubRace} />
            <SubCategoryBody mainEntryId={props.subRace.object?.id!}
                subObjects={props.subRace.subObjects}
                subCategoryTitle={"Region"} subCategoryLink={"regions"}
                fillTheListWithAllSubObjects={getAllRegions}
                addExistingObjectToRelation={saveExistingRegionToSubRace}
                deleteSubObject={removeRegionFromSubRaceFunction}
                addNewSubEntryToRelation={saveNewRegionToSubRace}
                addButtonActionText={"Add new region in which this sub race is present"}
                deleteButtonActionText={"Remove region in which this sub race is present"}
                addExistingButtonActionText={"Add region from the list in which this sub race is present"}
                subCategoryLinkText={"region"} />
        </Accordion.Body>
    )
}