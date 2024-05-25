import { Accordion } from "react-bootstrap";
import { EntryFullDTO } from "../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { PlaceFunction } from "./placeFunction";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { PlaceDomObjectsFunction } from "./placeDomObjectsFunction";


interface IPlaceAccordionBody {
    place: EntryFullDTO
}

export function PlaceAccordionBody(props: Readonly<IPlaceAccordionBody>) {

    const { deletePlace, editPlace, saveImageToPlace, deleteImageFromPlace } = PlaceFunction({ placeId: props.place.object?.id });
    const { setNewRegionToPlace, setExistingRegionToPlace, removeRegionFromPlaceFunction, getAllRegions } = PlaceDomObjectsFunction();

    return (
        <Accordion.Body>
            <DomCategoryBody categoryName={"Place"} mainEntryId={props.place.object?.id!}
                descriptionOfConnectionString={"Region of"} descriptionOfNullConnectionString={"This place isn't linked to any region."}
                domObject={props.place.domObjects}
                domCategoryName={"Region"} domCategoryLink={"regions"}
                fillTheListWithAllSubObjects={getAllRegions}
                setNewDomEntryToRelation={setNewRegionToPlace}
                addExistingObjectToRelation={setExistingRegionToPlace}
                deleteSubObject={removeRegionFromPlaceFunction}
                addButtonActionText={`Set new region to ${props.place.object?.name}`}
                deleteButtonActionText={`Unlink this place from region`}
                addExistingButtonActionText={`Set existing region to ${props.place.object?.name}`} />
            <FullEntryAccordionBody categoryName={"Place"} entryFullDTO={props.place}
                deleteEntry={deletePlace}
                updateEntry={editPlace}
                saveImageToEntry={saveImageToPlace}
                deleteImageFromEntry={deleteImageFromPlace}
                deleteMainObjectButtonActionText={"Delete this place"}
                deleteImageButtonActionText={"Delete image"} />
        </Accordion.Body>
    )
}