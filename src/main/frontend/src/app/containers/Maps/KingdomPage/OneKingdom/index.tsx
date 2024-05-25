import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { useAppSelector } from "../../../../hooks";

import { makeSelectOneKingdom } from "./store/selector";
import { UseOneKingdomObjectFunction } from "./useOneKingdomFunction";
import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { OneKingdomSubObjectsFunction } from "./oneKingdomSubObjectsFunction";
import { OneKingdomDomObjectsFunction } from "./oneKingdomDomObjectsFunction";

interface IOneKingdomProps {
}

const oneKingdomSelect = createSelector(makeSelectOneKingdom, (kingdomDTO) => ({
    kingdomDTO
}))

export function OneKingdom(props: IOneKingdomProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { kingdomDTO } = useAppSelector(oneKingdomSelect);
    const { fetchKingdom, removeKingdom, editKingdom, saveImageToKingdom, deleteImageFromKingdom } = UseOneKingdomObjectFunction({ kingdomId: kingdomDTO.object?.id });
    const { saveNewRegionToKingdom, saveExistingRegionToKingdom, removeRegionFromKingdomFunction, getAllRegionsWithoutKingdom } = OneKingdomSubObjectsFunction();
    const { setNewContinentToKingdom, setExistingContinentToKingdom, removeContinentFromKingdomFunction, getAllContinents } = OneKingdomDomObjectsFunction();
    
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