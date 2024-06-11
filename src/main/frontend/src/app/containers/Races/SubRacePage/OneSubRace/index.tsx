import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../../globalFunctions/RegionHooks";
import { useAppSelector } from "../../../../hooks";

import { makeSelectOneSubRace } from "./store/selector";
import { UseOneSubRaceObjectFunction } from "./useOneSubRaceFunction";
import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { OneSubRaceSubObjectsFunction } from "./oneSubRaceSubObjectsFunction";
import { OneSubRaceDomObjectsFunction } from "./oneSubRaceDomObjectsFunction";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";

interface IOneSubRaceProps {
}

const oneSubRaceSelect = createSelector(makeSelectOneSubRace, (subRaceDTO) => ({
    subRaceDTO
}))

export function OneSubRace(props: IOneSubRaceProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { subRaceDTO } = useAppSelector(oneSubRaceSelect);
    const { fetchSubRace, removeSubRace, editSubRace, saveImageToSubRace, deleteImageFromSubRace, addNewDesctiptionToSubRace, updateSubRaceDescription, deleteDescriptionFromSubRace } = UseOneSubRaceObjectFunction();
    const { saveNewRegionToSubRace, saveExistingRegionToSubRace, removeRegionFromSubRaceFunction } = OneSubRaceSubObjectsFunction();
    const { setNewRaceToSubRace, setExistingRaceToSubRace, removeRaceFromSubRaceFunction, getAllRaces } = OneSubRaceDomObjectsFunction();

    useEffect(() => {
        fetchSubRace(name!).then((res) => setExist(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!exist) return <div>
        <h1>SubRace named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this sub race"}
        deleteEntry={removeSubRace}
        updateEntry={editSubRace} categoryName={"race"} entryFullDTO={{
            object: subRaceDTO.race,
            images: subRaceDTO.images,
            domObjects: subRaceDTO.race,
            subObjects: [],
            descriptions: subRaceDTO.descriptions
        }}>
        <DomCategoryBody categoryName={"Race"} mainEntryId={subRaceDTO.subRace?.id!}
            descriptionOfConnectionString={"Sub race of"} descriptionOfNullConnectionString={"This sub race doesn't have main race."}
            domObject={subRaceDTO.race}
            domCategoryName={"Race"} domCategoryLink={"races"}
            fillTheListWithAllSubObjects={getAllRaces}
            setNewDomEntryToRelation={setNewRaceToSubRace}
            addExistingObjectToRelation={setExistingRaceToSubRace}
            deleteSubObject={removeRaceFromSubRaceFunction}
            addButtonActionText={`Set new core race of ${subRaceDTO.subRace?.name}`}
            deleteButtonActionText={`Unset core race of ${subRaceDTO.subRace?.name}`}
            addExistingButtonActionText={`Set core race for ${subRaceDTO.subRace?.name} from list`} />
        <FullEntryAccordionBody categoryName={"SubRace"} entryFullDTO={{
            object: subRaceDTO.subRace,
            images: subRaceDTO.images,
            domObjects: {},
            subObjects: subRaceDTO.regions
        }}
            saveImageToEntry={saveImageToSubRace}
            deleteImageFromEntry={deleteImageFromSubRace}
            deleteImageButtonActionText={"Delete image"} 
            addNewDescriptionToEntry={addNewDesctiptionToSubRace} 
            updateDescription={updateSubRaceDescription} 
            deleteDescriptionFromEntry={deleteDescriptionFromSubRace} />
        <SubCategoryBody mainEntryId={subRaceDTO.subRace?.id!}
            subObjects={subRaceDTO.regions}
            subCategoryTitle={"Regions"} subCategoryLink={"regions"}
            fillTheListWithAllSubObjects={getAllRegions}
            addExistingObjectToRelation={saveExistingRegionToSubRace}
            deleteSubObject={removeRegionFromSubRaceFunction}
            addNewSubEntryToRelation={saveNewRegionToSubRace}
            addButtonActionText={"Add new region in which this sub race exist"}
            addExistingButtonActionText={"Link existing region to places where this sub race occures"}
            deleteButtonActionText={`Unlink this region from ${subRaceDTO.subRace?.name}`}
            subCategoryLinkText={"region"} />
    </OneEntryHeaderLayout>
}