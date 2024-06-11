import { Accordion } from "react-bootstrap";
import { RegionDTO } from "../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { RegionFunction } from "./function/regionFunction";
import { RegionPlacesFunction } from "./function/regionPlacesFunction";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { RegionKingdomFunction } from "./function/regionKingdomFunction";
import { RegionCulturesFunction } from "./function/regionCulturesFunction";
import { RegionRacesFunction } from "./function/regionRacesFunction";
import { RegionSubRacesFunction } from "./function/regionSubRacesFunction";
import { RegionsDispatcher } from "./store/dispatcher";

interface IRegionAccordionBody {
    region: RegionDTO
}

export function RegionAccordionBody(props: Readonly<IRegionAccordionBody>) {
    const { addNewCultureToRegion, removeCultureFromRegion } = RegionsDispatcher();
    const { addImageToRegion, removeImageFromRegion, addNewStateRegionDescription, removeStateRegionDescription, updateStateRegionDescription } = RegionsDispatcher();
    const { setKingdomToRegion, removeKingdomFromRegion } = RegionsDispatcher();
    const { addNewPlaceToRegion, removePlaceFromRegion } = RegionsDispatcher();
    const { addNewRaceToRegion, removeRaceFromRegion } = RegionsDispatcher();
    const { addNewSubRaceToRegion, removeSubRaceFromRegion } = RegionsDispatcher();

    const { saveImageToRegion, deleteImageFromRegion, addNewDesctiptionToRegion, deleteDescriptionFromRegion, updateRegionDescription } = RegionFunction({
        addImageToRegion, removeImageFromRegion,
        addNewDescriptionRegion: addNewStateRegionDescription, removeDescriptionFromRegion: removeStateRegionDescription, updateStateRegionDescription
    });
    const { saveNewPlaceToRegion, saveExistingPlaceToRegion, removePlaceFromRegionFunction, getAllPlacesWithoutRegion } = RegionPlacesFunction({
        addNewPlaceToRegion,
        removePlaceFromRegion
    });
    const { setNewKingdomToRegion, setExistingKingdomToRegion, removeKingdomFromRegionFunction, getAllKingdoms } = RegionKingdomFunction({
        setKingdomToRegion,
        removeKingdomFromRegion
    });
    const { saveNewCultureToRegion, saveExistingCultureToRegion, removeCultureFromRegionFunction, getAllCultures } = RegionCulturesFunction({
        addNewCultureToRegion,
        removeCultureFromRegion
    });
    const { saveNewRaceToRegion, saveExistingRaceToRegion, removeRaceFromRegionFunction, getAllRaces } = RegionRacesFunction({
        addNewRaceToRegion,
        removeRaceFromRegion
    });
    const { saveNewSubRaceToRegion, saveExistingSubRaceToRegion, removeSubRaceFromRegionFunction, getAllSubRaces } = RegionSubRacesFunction({
        addNewSubRaceToRegion,
        removeSubRaceFromRegion
    });
    return (
        <Accordion.Body>
            <DomCategoryBody categoryName={"Region"} mainEntryId={props.region.region?.id!}
                descriptionOfConnectionString={"Kingdom of"} descriptionOfNullConnectionString={"This region isn't linked to any kingdom."}
                domObject={props.region.kingdom}
                domCategoryName={"Kingdom"} domCategoryLink={"kingdoms"}
                fillTheListWithAllSubObjects={getAllKingdoms}
                setNewDomEntryToRelation={setNewKingdomToRegion}
                addExistingObjectToRelation={setExistingKingdomToRegion}
                deleteSubObject={removeKingdomFromRegionFunction}
                addButtonActionText={`Set new kingdom to ${props.region.region?.name}`}
                deleteButtonActionText={`Unlink this region from kingdom`}
                addExistingButtonActionText={`Set existing kingdom to ${props.region.region?.name}`} />
            <FullEntryAccordionBody categoryName={"Region"} entryFullDTO={{
                object: props.region.region,
                domObjects: props.region.kingdom,
                subObjects: props.region.places,
                images: props.region.images,
                descriptions: props.region.descriptions
            }}
                saveImageToEntry={saveImageToRegion}
                deleteImageFromEntry={deleteImageFromRegion}
                deleteImageButtonActionText={"Delete image"}
                addNewDescriptionToEntry={addNewDesctiptionToRegion}
                updateDescription={updateRegionDescription}
                deleteDescriptionFromEntry={deleteDescriptionFromRegion} />
            <SubCategoryBody mainEntryId={props.region.region?.id!}
                subObjects={props.region.places}
                subCategoryTitle={"Places"} subCategoryLink={"places"}
                fillTheListWithAllSubObjects={getAllPlacesWithoutRegion}
                addExistingObjectToRelation={saveExistingPlaceToRegion}
                deleteSubObject={removePlaceFromRegionFunction}
                addNewSubEntryToRelation={saveNewPlaceToRegion}
                addButtonActionText={`Add new place to ${props.region.region?.name}`}
                addExistingButtonActionText={"Link existing place to this region"}
                deleteButtonActionText={`Unlink this place from ${props.region.region?.name}`}
                subCategoryLinkText={"place"} />
            <SubCategoryBody mainEntryId={props.region.region?.id!}
                subObjects={props.region.cultures}
                subCategoryTitle={"Cultures"} subCategoryLink={"cultures"}
                fillTheListWithAllSubObjects={getAllCultures}
                addExistingObjectToRelation={saveExistingCultureToRegion}
                deleteSubObject={removeCultureFromRegionFunction}
                addNewSubEntryToRelation={saveNewCultureToRegion}
                addButtonActionText={`Add new culture to ${props.region.region?.name}`}
                addExistingButtonActionText={"Link existing culture to this region"}
                deleteButtonActionText={`Unlink this culture from ${props.region.region?.name}`}
                subCategoryLinkText={"culture"} />
            <SubCategoryBody mainEntryId={props.region.region?.id!}
                subObjects={props.region.races}
                subCategoryTitle={"Races"} subCategoryLink={"races"}
                fillTheListWithAllSubObjects={getAllRaces}
                addExistingObjectToRelation={saveExistingRaceToRegion}
                deleteSubObject={removeRaceFromRegionFunction}
                addNewSubEntryToRelation={saveNewRaceToRegion}
                addButtonActionText={`Add new race to ${props.region.region?.name}`}
                addExistingButtonActionText={"Link existing race to this region"}
                deleteButtonActionText={`Unlink this race from ${props.region.region?.name}`}
                subCategoryLinkText={"race"} />
            <SubCategoryBody mainEntryId={props.region.region?.id!}
                subObjects={props.region.subRaces}
                subCategoryTitle={"Sub races"} subCategoryLink={"subraces"}
                fillTheListWithAllSubObjects={getAllSubRaces}
                addExistingObjectToRelation={saveExistingSubRaceToRegion}
                deleteSubObject={removeSubRaceFromRegionFunction}
                addNewSubEntryToRelation={saveNewSubRaceToRegion}
                addButtonActionText={`Add new sub race to ${props.region.region?.name}`}
                addExistingButtonActionText={"Link existing sub race to this region"}
                deleteButtonActionText={`Unlink this sub race from ${props.region.region?.name}`}
                subCategoryLinkText={"sub race"} />
        </Accordion.Body>
    )
}