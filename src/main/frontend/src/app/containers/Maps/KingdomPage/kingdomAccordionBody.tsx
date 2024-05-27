import { Accordion } from "react-bootstrap";
import { EntryFullDTO } from "../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { KingdomFunction } from "./function/kingdomFunction";
import { KingdomRegionsFunction } from "./function/kingdomRegionsFunction";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { KingdomDomContinentFunction } from "./function/kingdomDomContinentFunction";
import { KingdomsDispatcher } from "./store/dispatcher";

interface IKingdomAccordionBody {
    kingdom: EntryFullDTO
}

export function KingdomAccordionBody(props: Readonly<IKingdomAccordionBody>) {
    const { removeKingdom, updateKingdom, addImageToKingdom, removeImageFromKingdom } = KingdomsDispatcher();
    const { deleteKingdom, editKingdom, saveImageToKingdom, deleteImageFromKingdom } = KingdomFunction({
        kingdomId: props.kingdom.object?.id,
        removeKingdom, updateKingdom, addImageToKingdom, removeImageFromKingdom
    });

    const { addNewRegionToKingdom, removeRegionFromKingdom } = KingdomsDispatcher();
    const { saveNewRegionToKingdom, saveExistingRegionToKingdom, removeRegionFromKingdomFunction, getAllRegionsWithoutKingdom } = KingdomRegionsFunction({
        addNewRegionToKingdom, removeRegionFromKingdom
    });

    const { setContinentToKingdom, removeContinentFromKingdom } = KingdomsDispatcher();
    const { setNewContinentToKingdom, setExistingContinentToKingdom, removeContinentFromKingdomFunction, getAllContinents } = KingdomDomContinentFunction({
        setContinentToKingdom, removeContinentFromKingdom
    });

    return (
        <Accordion.Body>
            <DomCategoryBody categoryName={"Kingdom"} mainEntryId={props.kingdom.object?.id!}
                descriptionOfConnectionString={"Continent of"} descriptionOfNullConnectionString={"This kingdom isn't linked to any continent."}
                domObject={props.kingdom.domObjects}
                domCategoryName={"Continent"} domCategoryLink={"continents"}
                fillTheListWithAllSubObjects={getAllContinents}
                setNewDomEntryToRelation={setNewContinentToKingdom}
                addExistingObjectToRelation={setExistingContinentToKingdom}
                deleteSubObject={removeContinentFromKingdomFunction}
                addButtonActionText={`Set new continent to ${props.kingdom.object?.name}`}
                deleteButtonActionText={`Unlink this kingdom from continent`}
                addExistingButtonActionText={`Set existing continent to ${props.kingdom.object?.name}`} />
            <FullEntryAccordionBody categoryName={"Kingdom"} entryFullDTO={props.kingdom}
                deleteEntry={deleteKingdom}
                updateEntry={editKingdom}
                saveImageToEntry={saveImageToKingdom}
                deleteImageFromEntry={deleteImageFromKingdom}
                deleteMainObjectButtonActionText={"Delete this kingdom"}
                deleteImageButtonActionText={"Delete image"} />
            <SubCategoryBody mainEntryId={props.kingdom.object?.id!}
                subObjects={props.kingdom.subObjects}
                subCategoryTitle={"Regions"} subCategoryLink={"regions"}
                fillTheListWithAllSubObjects={getAllRegionsWithoutKingdom}
                addExistingObjectToRelation={saveExistingRegionToKingdom}
                deleteSubObject={removeRegionFromKingdomFunction}
                addNewSubEntryToRelation={saveNewRegionToKingdom}
                addButtonActionText={`Add new region to ${props.kingdom.object?.name}`}
                addExistingButtonActionText={"Link existing region to this kingdom"}
                deleteButtonActionText={`Unlink this region from ${props.kingdom.object?.name}`}
                subCategoryLinkText={"region"} />
        </Accordion.Body>
    )
}