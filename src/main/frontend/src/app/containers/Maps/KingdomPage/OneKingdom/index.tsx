import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { useAppSelector } from "../../../../hooks";

import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { KingdomDomContinentFunction } from "../function/kingdomDomContinentFunction";
import { KingdomFunction } from "../function/kingdomFunction";
import { KingdomRegionsFunction } from "../function/kingdomRegionsFunction";
import { OneKingdomDispatcher } from "./store/dispatcher";
import { makeSelectOneKingdom } from "./store/selector";
import { UseOneKingdomObjectFunction } from "./useOneKingdomFunction";

interface IOneKingdomProps {
}

const oneKingdomSelect = createSelector(makeSelectOneKingdom, (kingdomDTO) => ({
    kingdomDTO
}))

export function OneKingdom(props: IOneKingdomProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { kingdomDTO } = useAppSelector(oneKingdomSelect);
    const { addImageToKingdom, removeImageFromKingdom, updateKingdom } = OneKingdomDispatcher();
    const { fetchKingdom, removeKingdom } = UseOneKingdomObjectFunction({ kingdomId: kingdomDTO.object?.id });
    const { editKingdom, saveImageToKingdom, deleteImageFromKingdom } = KingdomFunction({ kingdomId: kingdomDTO.object?.id,
        updateOneKingdom: updateKingdom,
        addImageToOneKingdom: addImageToKingdom, 
        removeImageFromOneKingdom: removeImageFromKingdom
     });
    const { addNewRegionToKingdom, removeRegionFromKingdom } = OneKingdomDispatcher();
    const { saveNewRegionToKingdom, saveExistingRegionToKingdom, removeRegionFromKingdomFunction, getAllRegionsWithoutKingdom } = KingdomRegionsFunction({
        addNewRegionToOneKingdom: addNewRegionToKingdom, 
        removeRegionFromOneKingdom: removeRegionFromKingdom
    });
    const { setContinentToKingdom, removeContinentFromKingdom } = OneKingdomDispatcher();
    const { setNewContinentToKingdom, setExistingContinentToKingdom, removeContinentFromKingdomFunction, getAllContinents } = KingdomDomContinentFunction({
        setContinentToOneKingdom: setContinentToKingdom, 
        removeContinentFromOneKingdom: removeContinentFromKingdom
    });
    
    useEffect(() => {
        fetchKingdom(name!).then((res) => setExist(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!exist) return <div>
        <h1>Kingdom named {name} doesn't exist.</h1>
    </div>;

    return <div>
        <div className="d-grid gap-2">
            <h1>Kingdom {name}</h1>
            <Accordion key={kingdomDTO.object?.id} defaultActiveKey={['0']}>
                <Accordion.Item eventKey={'0'} className="borderFix" onClick={(e) => e.stopPropagation()}>
                    <Accordion.Header>
                        <h5><b>{kingdomDTO.object?.name}</b></h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <DomCategoryBody categoryName={"Continent"} mainEntryId={kingdomDTO.object?.id!}
                            descriptionOfConnectionString={"Continent of"} descriptionOfNullConnectionString={"This kingdom isn't linked to any continent."}
                            domObject={kingdomDTO.domObjects}
                            domCategoryName={"Continent"} domCategoryLink={"continents"}
                            fillTheListWithAllSubObjects={getAllContinents}
                            setNewDomEntryToRelation={setNewContinentToKingdom}
                            addExistingObjectToRelation={setExistingContinentToKingdom}
                            deleteSubObject={removeContinentFromKingdomFunction}
                            addButtonActionText={`Set new continent to ${kingdomDTO.object?.name}`}
                            deleteButtonActionText={`Unlink this kingdom from continent`}
                            addExistingButtonActionText={`Set existing continent to ${kingdomDTO.object?.name}`} />
                        <FullEntryAccordionBody categoryName={"Kingdom"} entryFullDTO={kingdomDTO}
                            deleteEntry={removeKingdom}
                            updateEntry={editKingdom}
                            saveImageToEntry={saveImageToKingdom}
                            deleteImageFromEntry={deleteImageFromKingdom}
                            deleteMainObjectButtonActionText={"Delete this kingdom"}
                            deleteImageButtonActionText={"Delete image"} />
                        <SubCategoryBody mainEntryId={kingdomDTO.object?.id!}
                            subObjects={kingdomDTO.subObjects}
                            subCategoryTitle={"Regions"} subCategoryLink={"regions"}
                            fillTheListWithAllSubObjects={getAllRegionsWithoutKingdom}
                            addExistingObjectToRelation={saveExistingRegionToKingdom}
                            deleteSubObject={removeRegionFromKingdomFunction}
                            addNewSubEntryToRelation={saveNewRegionToKingdom}
                            addButtonActionText={"Add new region to this kingdom"}
                            addExistingButtonActionText={"Link existing region to this kingdom"}
                            deleteButtonActionText={`Unlink this region from ${kingdomDTO.object?.name}`}
                            subCategoryLinkText={"region"} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    </div>
}