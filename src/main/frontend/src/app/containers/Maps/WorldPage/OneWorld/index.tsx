import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { useAppSelector } from "../../../../hooks";
import { OneWorldSubObjectsFunction } from "./oneWorldSubObjectsFunction";
import { makeSelectOneWorld } from "./store/selector";
import { UseOneWorldObjectFunction } from "./useOneWorldObjectFunction";

interface IOneWorldProps {
}

const oneWorldSelect = createSelector(makeSelectOneWorld, (worldDTO) => ({
    worldDTO
}))

export function OneWorld(props: IOneWorldProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { worldDTO } = useAppSelector(oneWorldSelect);
    const { fetchWorld, removeWorld, editWorld, saveImageToWorld, deleteImageFromWorld } = UseOneWorldObjectFunction({ worldId: worldDTO.object?.id });
    const { saveNewPlaneToWorld, saveExistingPlaneToWorld, removePlaneFromWorldFunction, getAllPlanesWithoutWorld } = OneWorldSubObjectsFunction();

    useEffect(() => {
        fetchWorld(name!).then((res) => setExist(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!exist) return <div>
        <h1>World named {name} doesn't exist.</h1>
    </div>;

    return <div>
        <div className="d-grid gap-2">
            <h1>World {name}</h1>
            <Accordion key={worldDTO.object?.id} defaultActiveKey={['0']}>
                <Accordion.Item eventKey={'0'} className="borderFix" onClick={(e) => e.stopPropagation()}>
                    <Accordion.Header>
                        <h5><b>{worldDTO.object?.name}</b></h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <FullEntryAccordionBody categoryName={"World"} entryFullDTO={worldDTO}
                            deleteEntry={removeWorld}
                            updateEntry={editWorld}
                            saveImageToEntry={saveImageToWorld}
                            deleteImageFromEntry={deleteImageFromWorld}
                            deleteMainObjectButtonActionText={"Delete this world"}
                            deleteImageButtonActionText={"Delete image"} />
                        <SubCategoryBody mainEntryId={worldDTO.object?.id!}
                            subObjects={worldDTO.subObjects}
                            subCategoryTitle={"Planes"} subCategoryLink={"planes"}
                            fillTheListWithAllSubObjects={getAllPlanesWithoutWorld}
                            addNewSubEntryToRelation={saveNewPlaneToWorld}
                            addExistingObjectToRelation={saveExistingPlaneToWorld}
                            deleteSubObject={removePlaneFromWorldFunction}
                            addButtonActionText={`Add new plane that exist on ${worldDTO.object?.name}`}
                            addExistingButtonActionText={"Link existing plane to this world"}
                            deleteButtonActionText={`Unlink this plane from ${worldDTO.object?.name}`}
                            subCategoryLinkText={"plane"} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    </div>
}