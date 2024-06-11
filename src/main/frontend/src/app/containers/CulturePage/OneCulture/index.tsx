import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../globalFunctions/RegionHooks";
import { useAppSelector } from "../../../hooks";
import { OneCultureSubObjectsFunction } from "./oneCultureSubObjectsFunction";
import { makeSelectOneCulture } from "./store/selector";
import { UseOneCultureFunction } from "./useOneCultureFunction";

interface IOneCultureProps {
}

const oneCultureSelect = createSelector(makeSelectOneCulture, (culture) => ({
    culture
}))

export function OneCulture(props: IOneCultureProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { culture } = useAppSelector(oneCultureSelect);
    const { fetchCulture, removeCulture, editCulture, saveImageToCulture, deleteImageFromCulture, addNewDesctiptionToCulture, updateCultureDescription, deleteDescriptionFromCulture, } = UseOneCultureFunction();
    const { saveNewRegionToCulture, saveExistingRegionToCulture, removeRegionFromCultureFunction } = OneCultureSubObjectsFunction();
    useEffect(() => {
        fetchCulture(name!).then((res) => setExist(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!exist) return <div>
        <h1>Culture named {name} doesn't exist.</h1>
    </div>;
    
    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this culture"}
        deleteEntry={removeCulture}
        updateEntry={editCulture} categoryName={"culture"} entryFullDTO={culture}>
        <FullEntryAccordionBody categoryName={"culture"} entryFullDTO={culture}
            saveImageToEntry={saveImageToCulture}
            deleteImageFromEntry={deleteImageFromCulture}
            deleteImageButtonActionText={"Delete image"} 
            addNewDescriptionToEntry={addNewDesctiptionToCulture} 
            updateDescription={updateCultureDescription} 
            deleteDescriptionFromEntry={deleteDescriptionFromCulture} />
        <SubCategoryBody mainEntryId={culture.object?.id!}
            subObjects={culture.subObjects}
            subCategoryTitle={"Region"} subCategoryLink={"regions"}
            fillTheListWithAllSubObjects={getAllRegions}
            addNewSubEntryToRelation={saveNewRegionToCulture}
            addExistingObjectToRelation={saveExistingRegionToCulture}
            deleteSubObject={removeRegionFromCultureFunction}
            addButtonActionText={"Add new region that use this culture"}
            addExistingButtonActionText={"Link existing region from list to this culture"}
            deleteButtonActionText={`Unlink this region from ${culture.object?.name}`}
            subCategoryLinkText={"region"} />
    </OneEntryHeaderLayout>
}