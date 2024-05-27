import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { useAppSelector } from "../../../../hooks";

import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { RegionCulturesFunction } from "../function/regionCulturesFunction";
import { RegionFunction } from "../function/regionFunction";
import { RegionKingdomFunction } from "../function/regionKingdomFunction";
import { RegionPlacesFunction } from "../function/regionPlacesFunction";
import { RegionRacesFunction } from "../function/regionRacesFunction";
import { RegionSubRacesFunction } from "../function/regionSubRacesFunction";
import { OneRegionDispatcher } from "./store/dispatcher";
import { makeSelectOneRegion } from "./store/selector";
import { UseOneRegionFunction } from "./useOneRegionFunction";

interface IOneRegionProps {
}

const oneRegionSelect = createSelector(makeSelectOneRegion, (regionDTO) => ({
    regionDTO
}))

export function OneRegion(props: IOneRegionProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { regionDTO } = useAppSelector(oneRegionSelect);

    const { addNewCultureToRegion, removeCultureFromRegion } = OneRegionDispatcher();
    const { updateRegion, addImageToRegion, removeImageFromRegion } = OneRegionDispatcher();
    const { setKingdomToRegion, removeKingdomFromRegion } = OneRegionDispatcher();
    const { addNewPlaceToRegion, removePlaceFromRegion } = OneRegionDispatcher();
    const { addNewRaceToRegion, removeRaceFromRegion } = OneRegionDispatcher();
    const { addNewSubRaceToRegion, removeSubRaceFromRegion } = OneRegionDispatcher();

    const { fetchRegion, removeRegion } = UseOneRegionFunction({ regionId: regionDTO.region?.id });
    const { editRegion, saveImageToRegion, deleteImageFromRegion } = RegionFunction({
        regionId: regionDTO.region?.id,
        updateOneRegion: updateRegion,
        addImageToOneRegion: addImageToRegion,
        removeImageFromOneRegion: removeImageFromRegion
    });

    const { saveNewPlaceToRegion, saveExistingPlaceToRegion, removePlaceFromRegionFunction, getAllPlacesWithoutRegion } = RegionPlacesFunction({
        addNewPlaceToOneRegion: addNewPlaceToRegion,
        removePlaceFromOneRegion: removePlaceFromRegion
    });
    const { setNewKingdomToRegion, setExistingKingdomToRegion, removeKingdomFromRegionFunction, getAllKingdoms } = RegionKingdomFunction({
        setKingdomToOneRegion: setKingdomToRegion,
        removeKingdomFromOneRegion: removeKingdomFromRegion
    });
    const { saveNewCultureToRegion, saveExistingCultureToRegion, removeCultureFromRegionFunction, getAllCultures } = RegionCulturesFunction({
        addNewCultureToOneRegion: addNewCultureToRegion
        , removeCultureFromOneRegion: removeCultureFromRegion
    });
    const { saveNewRaceToRegion, saveExistingRaceToRegion, removeRaceFromRegionFunction, getAllRaces } = RegionRacesFunction({
        addNewRaceToOneRegion: addNewRaceToRegion,
        removeRaceFromOneRegion: removeRaceFromRegion
    });
    const { saveNewSubRaceToRegion, saveExistingSubRaceToRegion, removeSubRaceFromRegionFunction, getAllSubRaces } = RegionSubRacesFunction({
        addNewSubRaceToOneRegion: addNewSubRaceToRegion,
        removeSubRaceFromOneRegion: removeSubRaceFromRegion
    });

    useEffect(() => {
        fetchRegion(name!).then((res) => setExist(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!exist) return <div>
        <h1>Region named {name} doesn't exist.</h1>
    </div>;

    return <div>
        <div className="d-grid gap-2">
            <h1>Region {name}</h1>
            <Accordion key={regionDTO.region?.id} defaultActiveKey={['0']}>
                <Accordion.Item eventKey={'0'} className="borderFix" onClick={(e) => e.stopPropagation()}>
                    <Accordion.Header>
                        <h5><b>{regionDTO.region?.name}</b></h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <DomCategoryBody categoryName={"Region"} mainEntryId={regionDTO.region?.id!}
                            descriptionOfConnectionString={"Kingdom of"} descriptionOfNullConnectionString={"This region isn't linked to any kingdom."}
                            domObject={regionDTO.kingdom}
                            domCategoryName={"Kingdom"} domCategoryLink={"kingdoms"}
                            fillTheListWithAllSubObjects={getAllKingdoms}
                            setNewDomEntryToRelation={setNewKingdomToRegion}
                            addExistingObjectToRelation={setExistingKingdomToRegion}
                            deleteSubObject={removeKingdomFromRegionFunction}
                            addButtonActionText={`Set new kingdom to ${regionDTO.region?.name}`}
                            deleteButtonActionText={`Unlink this region from kingdom`}
                            addExistingButtonActionText={`Set existing kingdom to ${regionDTO.region?.name}`} />
                        <FullEntryAccordionBody categoryName={"Region"} entryFullDTO={{
                            object: regionDTO.region,
                            images: regionDTO.images,
                            domObjects: regionDTO.kingdom,
                            subObjects: regionDTO.places
                        }}
                            deleteEntry={removeRegion}
                            updateEntry={editRegion}
                            saveImageToEntry={saveImageToRegion}
                            deleteImageFromEntry={deleteImageFromRegion}
                            deleteMainObjectButtonActionText={"Delete this region"}
                            deleteImageButtonActionText={"Delete image"} />
                        <SubCategoryBody mainEntryId={regionDTO.region?.id!}
                            subObjects={regionDTO.places}
                            subCategoryTitle={"Places"} subCategoryLink={"places"}
                            fillTheListWithAllSubObjects={getAllPlacesWithoutRegion}
                            addExistingObjectToRelation={saveExistingPlaceToRegion}
                            deleteSubObject={removePlaceFromRegionFunction}
                            addNewSubEntryToRelation={saveNewPlaceToRegion}
                            addButtonActionText={`Add new place to ${regionDTO.region?.name}`}
                            addExistingButtonActionText={"Link existing place to this region"}
                            deleteButtonActionText={`Unlink this place from ${regionDTO.region?.name}`}
                            subCategoryLinkText={"place"} />
                        <SubCategoryBody mainEntryId={regionDTO.region?.id!}
                            subObjects={regionDTO.cultures}
                            subCategoryTitle={"Cultures"} subCategoryLink={"cultures"}
                            fillTheListWithAllSubObjects={getAllCultures}
                            addExistingObjectToRelation={saveExistingCultureToRegion}
                            deleteSubObject={removeCultureFromRegionFunction}
                            addNewSubEntryToRelation={saveNewCultureToRegion}
                            addButtonActionText={`Add new culture to ${regionDTO.region?.name}`}
                            addExistingButtonActionText={"Link existing culture to this region"}
                            deleteButtonActionText={`Unlink this culture from ${regionDTO.region?.name}`}
                            subCategoryLinkText={"culture"} />
                        <SubCategoryBody mainEntryId={regionDTO.region?.id!}
                            subObjects={regionDTO.races}
                            subCategoryTitle={"Races"} subCategoryLink={"races"}
                            fillTheListWithAllSubObjects={getAllRaces}
                            addExistingObjectToRelation={saveExistingRaceToRegion}
                            deleteSubObject={removeRaceFromRegionFunction}
                            addNewSubEntryToRelation={saveNewRaceToRegion}
                            addButtonActionText={`Add new race to ${regionDTO.region?.name}`}
                            addExistingButtonActionText={"Link existing race to this region"}
                            deleteButtonActionText={`Unlink this race from ${regionDTO.region?.name}`}
                            subCategoryLinkText={"race"} />
                        <SubCategoryBody mainEntryId={regionDTO.region?.id!}
                            subObjects={regionDTO.subRaces}
                            subCategoryTitle={"Sub races"} subCategoryLink={"subraces"}
                            fillTheListWithAllSubObjects={getAllSubRaces}
                            addExistingObjectToRelation={saveExistingSubRaceToRegion}
                            deleteSubObject={removeSubRaceFromRegionFunction}
                            addNewSubEntryToRelation={saveNewSubRaceToRegion}
                            addButtonActionText={`Add new sub race to ${regionDTO.region?.name}`}
                            addExistingButtonActionText={"Link existing sub race to this region"}
                            deleteButtonActionText={`Unlink this sub race from ${regionDTO.region?.name}`}
                            subCategoryLinkText={"sub race"} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    </div>
}