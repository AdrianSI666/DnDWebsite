import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { useAppSelector } from "../../../../hooks";

import { makeSelectOnePlane } from "./store/selector";
import { UseOnePlaneObjectFunction } from "./useOnePlaneFunction";
import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { OnePlaneSubObjectsFunction } from "./onePlaneSubObjectsFunction";
import { OnePlaneDomObjectsFunction } from "./onePlaneDomObjectsFunction";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";

interface IOnePlaneProps {
}

const onePlaneSelect = createSelector(makeSelectOnePlane, (planeDTO) => ({
    planeDTO
}))

export function OnePlane(props: IOnePlaneProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { planeDTO } = useAppSelector(onePlaneSelect);
    const { fetchPlane, removePlane, editPlane, saveImageToPlane, deleteImageFromPlane, addNewDesctiptionToPlane, updatePlaneDescription, deleteDescriptionFromPlane } = UseOnePlaneObjectFunction();
    const { saveNewContinentToPlane, saveExistingContinentToPlane, removeContinentFromPlaneFunction, getAllContinentsWithoutPlane } = OnePlaneSubObjectsFunction();
    const { setNewWorldToPlane, setExistingWorldToPlane, removeWorldFromPlaneFunction, getAllWorlds } = OnePlaneDomObjectsFunction();

    useEffect(() => {
        fetchPlane(name!).then((res) => setExist(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!exist) return <div>
        <h1>Plane named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this plane"}
        deleteEntry={removePlane}
        updateEntry={editPlane} categoryName={"plane"} entryFullDTO={planeDTO}>
        <DomCategoryBody categoryName={"World"} mainEntryId={planeDTO.object?.id!}
            descriptionOfConnectionString={"World of"} descriptionOfNullConnectionString={"This plane isn't linked to any world."}
            domObject={planeDTO.domObjects}
            domCategoryName={"World"} domCategoryLink={"worlds"}
            fillTheListWithAllSubObjects={getAllWorlds}
            setNewDomEntryToRelation={setNewWorldToPlane}
            addExistingObjectToRelation={setExistingWorldToPlane}
            deleteSubObject={removeWorldFromPlaneFunction}
            addButtonActionText={`Set new world to ${planeDTO.object?.name}`}
            deleteButtonActionText={`Unlink this plane from world`}
            addExistingButtonActionText={`Set existing world to ${planeDTO.object?.name}`} />
        <FullEntryAccordionBody categoryName={"Plane"} entryFullDTO={planeDTO}
            saveImageToEntry={saveImageToPlane}
            deleteImageFromEntry={deleteImageFromPlane}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToPlane}
            updateDescription={updatePlaneDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromPlane} />
        <SubCategoryBody mainEntryId={planeDTO.object?.id!}
            subObjects={planeDTO.subObjects}
            subCategoryTitle={"Continents"} subCategoryLink={"continents"}
            fillTheListWithAllSubObjects={getAllContinentsWithoutPlane}
            addExistingObjectToRelation={saveExistingContinentToPlane}
            deleteSubObject={removeContinentFromPlaneFunction}
            addNewSubEntryToRelation={saveNewContinentToPlane}
            addButtonActionText={"Add new continent to this plane"}
            addExistingButtonActionText={"Link existing continent to this plane"}
            deleteButtonActionText={`Unlink this continent from ${planeDTO.object?.name}`}
            subCategoryLinkText={"continent"} />
    </OneEntryHeaderLayout>
}