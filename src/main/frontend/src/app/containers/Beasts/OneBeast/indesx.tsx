import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../globalFunctions/RegionHooks";
import { useAppSelector } from "../../../hooks";
import { OneBeastSubObjectsFunction } from "./oneBeastSubObjectFunction";
import { makeSelectOneBeast } from "./store/selector";
import { UseOneBeastFunction } from "./useOneBeastFunction";

interface IOneBeastProps {
}

const oneBeastSelect = createSelector(makeSelectOneBeast, (beast) => ({
    beast
}))

export function OneBeast(props: IOneBeastProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { beast } = useAppSelector(oneBeastSelect);
    const { fetchBeast, removeBeast, editBeast, saveImageToBeast, deleteImageFromBeast, addNewDesctiptionToBeast, updateBeastDescription, deleteDescriptionFromBeast, } = UseOneBeastFunction();
    const { saveNewRegionToBeast, saveExistingRegionToBeast, removeRegionFromBeastFunction } = OneBeastSubObjectsFunction();
    useEffect(() => {
        fetchBeast(name!).then((res) => setExist(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!exist) return <div>
        <h1>Beast named {name} doesn't exist.</h1>
    </div>;
    
    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this beast"}
        deleteEntry={removeBeast}
        updateEntry={editBeast} categoryName={"beast"} entryFullDTO={beast}>
        <FullEntryAccordionBody categoryName={"beast"} entryFullDTO={beast}
            saveImageToEntry={saveImageToBeast}
            deleteImageFromEntry={deleteImageFromBeast}
            deleteImageButtonActionText={"Delete image"} 
            addNewDescriptionToEntry={addNewDesctiptionToBeast} 
            updateDescription={updateBeastDescription} 
            deleteDescriptionFromEntry={deleteDescriptionFromBeast} />
        {/* <SubCategoryBody mainEntryId={beast.regions?.id!}
            subObjects={culture.subObjects}
            subCategoryTitle={"Region"} subCategoryLink={"regions"}
            fillTheListWithAllSubObjects={getAllRegions}
            addNewSubEntryToRelation={saveNewRegionToCulture}
            addExistingObjectToRelation={saveExistingRegionToCulture}
            deleteSubObject={removeRegionFromCultureFunction}
            addButtonActionText={"Add new region that use this culture"}
            addExistingButtonActionText={"Link existing region from list to this culture"}
            deleteButtonActionText={`Unlink this region from ${culture.object?.name}`}
            subCategoryLinkText={"region"} /> */}
    </OneEntryHeaderLayout>
}