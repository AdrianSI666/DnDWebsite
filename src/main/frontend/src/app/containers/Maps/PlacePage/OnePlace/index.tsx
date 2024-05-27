import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { useAppSelector } from "../../../../hooks";

import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
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
    const { addImageToPlace, removeImageFromPlace, updatePlace } = OnePlaceDispatcher();
    const { fetchPlace, removePlace } = UseOnePlaceObjectFunction({ placeId: placeDTO.object?.id });
    const { editPlace, saveImageToPlace, deleteImageFromPlace } = PlaceFunction({placeId: placeDTO.object?.id,
        addImageToOnePlace: addImageToPlace, 
        removeImageFromOnePlace: removeImageFromPlace,
        updateOnePlace: updatePlace
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

    return <div>
        <div className="d-grid gap-2">
            <h1>Place {name}</h1>
            <Accordion key={placeDTO.object?.id} defaultActiveKey={['0']}>
                <Accordion.Item eventKey={'0'} className="borderFix" onClick={(e) => e.stopPropagation()}>
                    <Accordion.Header>
                        <h5><b>{placeDTO.object?.name}</b></h5>
                    </Accordion.Header>
                    <Accordion.Body>
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
                            deleteEntry={removePlace}
                            updateEntry={editPlace}
                            saveImageToEntry={saveImageToPlace}
                            deleteImageFromEntry={deleteImageFromPlace}
                            deleteMainObjectButtonActionText={"Delete this place"}
                            deleteImageButtonActionText={"Delete image"} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    </div>
}