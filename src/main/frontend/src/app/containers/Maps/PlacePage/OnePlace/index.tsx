import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { useAppSelector } from "../../../../hooks";

import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { PlaceDomRegionFunction } from "../function/placeDomRegionFunction";
import { PlaceFunction } from "../function/placeFunction";
import { OnePlaceDispatcher } from "./store/dispatcher";
import { makeSelectOnePlace } from "./store/selector";
import { UseOnePlaceObjectFunction } from "./useOnePlaceFunction";

interface IOnePlaceProps {
}

const onePlaceSelect = createSelector(makeSelectOnePlace, (placeDTO) => ({
    placeDTO
}))

export function OnePlace(props: IOnePlaceProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { placeDTO } = useAppSelector(onePlaceSelect);
    const { addImageToPlace, removeImageFromPlace, updatePlace, addNewStatePlaceDescription, updateStatePlaceDescription, removeStatePlaceDescription } = OnePlaceDispatcher();
    const { fetchPlace, removePlace } = UseOnePlaceObjectFunction();

    const { editPlace, saveImageToPlace, deleteImageFromPlace, addNewDesctiptionToPlace, updatePlaceDescription, deleteDescriptionFromPlace } = PlaceFunction({
        addImageToOnePlace: addImageToPlace,
        removeImageFromOnePlace: removeImageFromPlace,
        updateOnePlace: updatePlace,
        addNewDescriptionOnePlace: addNewStatePlaceDescription,
        updateStateOnePlaceDescription: updateStatePlaceDescription,
        removeDescriptionFromOnePlace: removeStatePlaceDescription
    })

    const { setRegionToPlace, removeRegionFromPlace } = OnePlaceDispatcher();
    const { setNewRegionToPlace, setExistingRegionToPlace, removeRegionFromPlaceFunction, getAllRegions } = PlaceDomRegionFunction({
        setRegionToOnePlace: setRegionToPlace,
        removeRegionFromOnePlace: removeRegionFromPlace
    });

    useEffect(() => {
        fetchPlace(name!).then((res) => setExist(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!exist) return <div>
        <h1>Place named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this place"}
        deleteEntry={removePlace}
        updateEntry={editPlace} categoryName={"place"}
        entryFullDTO={placeDTO}>
        <DomCategoryBody categoryName={"Region"} mainEntryId={placeDTO.object?.id!}
            descriptionOfConnectionString={"Region of"} descriptionOfNullConnectionString={"This place isn't linked to any region."}
            domObject={placeDTO.domObjects}
            domCategoryName={"Region"} domCategoryLink={"regions"}
            fillTheListWithAllSubObjects={getAllRegions}
            setNewDomEntryToRelation={setNewRegionToPlace}
            addExistingObjectToRelation={setExistingRegionToPlace}
            deleteSubObject={removeRegionFromPlaceFunction}
            addButtonActionText={`Set new region to ${placeDTO.object?.name}`}
            deleteButtonActionText={`Unlink this place from region`}
            addExistingButtonActionText={`Set existing region to ${placeDTO.object?.name}`} />
        <FullEntryAccordionBody categoryName={"Place"} entryFullDTO={placeDTO}
            saveImageToEntry={saveImageToPlace}
            deleteImageFromEntry={deleteImageFromPlace}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToPlace}
            updateDescription={updatePlaceDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromPlace} />
    </OneEntryHeaderLayout>
}