import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { useAppSelector } from "../../../../hooks";

import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { OneContinentDomObjectsFunction } from "./oneContinentDomObjectsFunction";
import { OneContinentSubObjectsFunction } from "./oneContinentSubObjectsFunction";
import { makeSelectOneContinent } from "./store/selector";
import { UseOneContinentObjectFunction } from "./useOneContinentFunction";

interface IOneContinentProps {
}

const oneContinentSelect = createSelector(makeSelectOneContinent, (continentDTO) => ({
    continentDTO
}))

export function OneContinent(props: IOneContinentProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { continentDTO } = useAppSelector(oneContinentSelect);
    const { fetchContinent, removeContinent, editContinent,
        addNewDesctiptionToContinent, updateContinentDescription, deleteDescriptionFromContinent,
        saveImageToContinent, deleteImageFromContinent } = UseOneContinentObjectFunction();
    const { saveNewKingdomToContinent, saveExistingKingdomToContinent, removeKingdomFromContinentFunction, getAllKingdomsWithoutContinent } = OneContinentSubObjectsFunction();
    const { setNewPlaneToContinent, setExistingPlaneToContinent, removePlaneFromContinentFunction, getAllPlanes } = OneContinentDomObjectsFunction();

    useEffect(() => {
        fetchContinent(name!).then((res) => setExist(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!exist) return <div>
        <h1>Continent named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this continent"}
        deleteEntry={removeContinent}
        updateEntry={editContinent} categoryName={"continent"} entryFullDTO={continentDTO}>
        <DomCategoryBody categoryName={"Plane"} mainEntryId={continentDTO.object?.id!}
            descriptionOfConnectionString={"Plane of"} descriptionOfNullConnectionString={"This continent isn't linked to any plane."}
            domObject={continentDTO.domObjects}
            domCategoryName={"Plane"} domCategoryLink={"planes"}
            fillTheListWithAllSubObjects={getAllPlanes}
            setNewDomEntryToRelation={setNewPlaneToContinent}
            addExistingObjectToRelation={setExistingPlaneToContinent}
            deleteSubObject={removePlaneFromContinentFunction}
            addButtonActionText={`Set new plane to ${continentDTO.object?.name}`}
            deleteButtonActionText={`Unlink this continent from plane`}
            addExistingButtonActionText={`Set existing plane to ${continentDTO.object?.name}`} />
        <FullEntryAccordionBody categoryName={"Continent"} entryFullDTO={continentDTO}
            saveImageToEntry={saveImageToContinent}
            deleteImageFromEntry={deleteImageFromContinent}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToContinent}
            updateDescription={updateContinentDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromContinent} />
        <SubCategoryBody mainEntryId={continentDTO.object?.id!}
            subObjects={continentDTO.subObjects}
            subCategoryTitle={"Kingdoms"} subCategoryLink={"kingdoms"}
            fillTheListWithAllSubObjects={getAllKingdomsWithoutContinent}
            addExistingObjectToRelation={saveExistingKingdomToContinent}
            deleteSubObject={removeKingdomFromContinentFunction}
            addNewSubEntryToRelation={saveNewKingdomToContinent}
            addButtonActionText={"Add new kingdom to this continent"}
            addExistingButtonActionText={"Link existing kingdom to this continent"}
            deleteButtonActionText={`Unlink this kingdom from ${continentDTO.object?.name}`}
            subCategoryLinkText={"kingdom"} />
    </OneEntryHeaderLayout>
}