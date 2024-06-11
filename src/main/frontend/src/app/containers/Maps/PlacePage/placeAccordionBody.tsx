import { Accordion } from "react-bootstrap";
import { EntryFullDTO } from "../../../../services/openapi";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { PlaceDomRegionFunction } from "./function/placeDomRegionFunction";
import { PlaceFunction } from "./function/placeFunction";
import { PlaceDispatcher } from "./store/dispatcher";


interface IPlaceAccordionBody {
    place: EntryFullDTO
}

export function PlaceAccordionBody(props: Readonly<IPlaceAccordionBody>) {
    const { removePlace, addImageToPlace, removeImageFromPlace, updatePlace } = PlaceDispatcher();
    const { setRegionToPlace, removeRegionFromPlace, addNewStatePlaceDescription, updateStatePlaceDescription, removeStatePlaceDescription, } = PlaceDispatcher();
    const {
        addNewDesctiptionToPlace, deleteDescriptionFromPlace, updatePlaceDescription,
        saveImageToPlace, deleteImageFromPlace } = PlaceFunction({
            removePlace, updatePlace,
            addNewDescriptionPlace: addNewStatePlaceDescription, removeDescriptionFromPlace: removeStatePlaceDescription, updateStatePlaceDescription,
            addImageToPlace, removeImageFromPlace,
        });
    const { setNewRegionToPlace, setExistingRegionToPlace, removeRegionFromPlaceFunction, getAllRegions } = PlaceDomRegionFunction({
        setRegionToPlace, removeRegionFromPlace
    });

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
                saveImageToEntry={saveImageToPlace}
                deleteImageFromEntry={deleteImageFromPlace}
                deleteImageButtonActionText={"Delete image"}
                addNewDescriptionToEntry={addNewDesctiptionToPlace}
                updateDescription={updatePlaceDescription}
                deleteDescriptionFromEntry={deleteDescriptionFromPlace} />
        </Accordion.Body>
    )
}