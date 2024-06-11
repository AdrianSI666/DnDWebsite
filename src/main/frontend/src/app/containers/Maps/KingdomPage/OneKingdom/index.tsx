import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { useAppSelector } from "../../../../hooks";

import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
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
    const { addImageToKingdom, removeImageFromKingdom, updateKingdom,
        addNewStateKingdomDescription, updateStateKingdomDescription, removeStateKingdomDescription
    } = OneKingdomDispatcher();
    const { fetchKingdom, removeKingdom } = UseOneKingdomObjectFunction();
    const { editKingdom, saveImageToKingdom, deleteImageFromKingdom,
        addNewDesctiptionToKingdom, updateKingdomDescription, deleteDescriptionFromKingdom
    } = KingdomFunction({
        updateOneKingdom: updateKingdom,
        addImageToOneKingdom: addImageToKingdom,
        removeImageFromOneKingdom: removeImageFromKingdom,
        addNewDescriptionOneKingdom: addNewStateKingdomDescription,
        updateStateOneKingdomDescription: updateStateKingdomDescription,
        removeDescriptionFromOneKingdom: removeStateKingdomDescription
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

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this kingdom"}
        deleteEntry={removeKingdom}
        updateEntry={editKingdom} categoryName={"kingdom"}
        entryFullDTO={kingdomDTO}>
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
            saveImageToEntry={saveImageToKingdom}
            deleteImageFromEntry={deleteImageFromKingdom}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToKingdom}
            updateDescription={updateKingdomDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromKingdom} />
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
    </OneEntryHeaderLayout>
}