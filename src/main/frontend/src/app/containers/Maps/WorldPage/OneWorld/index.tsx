import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { useAppSelector } from "../../../../hooks";
import { OneWorldSubObjectsFunction } from "./oneWorldSubObjectsFunction";
import { makeSelectOneWorld } from "./store/selector";
import { UseOneWorldObjectFunction } from "./useOneWorldObjectFunction";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";

interface IOneWorldProps {
}

const oneWorldSelect = createSelector(makeSelectOneWorld, (worldDTO) => ({
    worldDTO
}))

export function OneWorld(props: IOneWorldProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { worldDTO } = useAppSelector(oneWorldSelect);
    const { fetchWorld, removeWorld, editWorld, saveImageToWorld, deleteImageFromWorld, addNewDesctiptionToWorld, updateWorldDescription, deleteDescriptionFromWorld } = UseOneWorldObjectFunction();
    const { saveNewPlaneToWorld, saveExistingPlaneToWorld, removePlaneFromWorldFunction, getAllPlanesWithoutWorld } = OneWorldSubObjectsFunction();

    useEffect(() => {
        fetchWorld(name!).then((res) => setExist(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!exist) return <div>
        <h1>World named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this world"}
        deleteEntry={removeWorld}
        updateEntry={editWorld} categoryName={"world"} entryFullDTO={worldDTO}>
        <FullEntryAccordionBody categoryName={"World"} entryFullDTO={worldDTO}
            saveImageToEntry={saveImageToWorld}
            deleteImageFromEntry={deleteImageFromWorld}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToWorld}
            updateDescription={updateWorldDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromWorld} />
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
    </OneEntryHeaderLayout>
}