import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../../globalFunctions/RegionHooks";
import { useAppSelector } from "../../../../hooks";
import { OneRaceSubObjectsFunction } from "./oneRaceSubObjectsFunction";
import { makeSelectOneRace } from "./store/selector";
import { UseOneRaceObjectFunction } from "./useOneRaceObjectFunction";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";

interface IOneRaceProps {
}

const oneRaceSelect = createSelector(makeSelectOneRace, (raceDTO) => ({
    raceDTO
}))

export function OneRace(props: IOneRaceProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { raceDTO } = useAppSelector(oneRaceSelect);
    const { fetchRace, removeRace, editRace, saveImageToRace, deleteImageFromRace, addNewDesctiptionToRace, updateRaceDescription, deleteDescriptionFromRace } = UseOneRaceObjectFunction();
    const { getAllSubRacesWithoutRace, removeSubRaceFromRaceFunction, saveNewSubRaceToRace, saveExistingSubRaceToRace, removeRegionFromRaceFunction, saveNewRegionToRace, saveExistingRegionToRace } = OneRaceSubObjectsFunction();

    useEffect(() => {
        fetchRace(name!).then((res) => setExist(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!exist) return <div>
        <h1>Race named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this race"}
        deleteEntry={removeRace}
        updateEntry={editRace} categoryName={"race"} entryFullDTO={{
            object: raceDTO.race,
            images: raceDTO.images,
            domObjects: {},
            subObjects: raceDTO.subRaces,
            descriptions: raceDTO.descriptions
        }}>
        <FullEntryAccordionBody categoryName={"Race"} entryFullDTO={{
            object: raceDTO.race,
            images: raceDTO.images,
            domObjects: {},
            subObjects: raceDTO.subRaces,
            descriptions: raceDTO.descriptions
        }}
            saveImageToEntry={saveImageToRace}
            deleteImageFromEntry={deleteImageFromRace}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToRace}
            updateDescription={updateRaceDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromRace} />
        <SubCategoryBody mainEntryId={raceDTO.race?.id!}
            subObjects={raceDTO.subRaces}
            subCategoryTitle={"Sub Races"} subCategoryLink={"subRaces"}
            fillTheListWithAllSubObjects={getAllSubRacesWithoutRace}
            addNewSubEntryToRelation={saveNewSubRaceToRace}
            addExistingObjectToRelation={saveExistingSubRaceToRace}
            deleteSubObject={removeSubRaceFromRaceFunction}
            addButtonActionText={"Add new sub race that originated from this race"}
            addExistingButtonActionText={"Link existing sub race to this main race"}
            deleteButtonActionText={`Unlink this sub race from ${raceDTO.race?.name}`}
            subCategoryLinkText={"sub race"} />
        <SubCategoryBody mainEntryId={raceDTO.race?.id!}
            subObjects={raceDTO.regions}
            subCategoryTitle={"Regions"} subCategoryLink={"regions"}
            fillTheListWithAllSubObjects={getAllRegions}
            addExistingObjectToRelation={saveExistingRegionToRace}
            deleteSubObject={removeRegionFromRaceFunction}
            addNewSubEntryToRelation={saveNewRegionToRace}
            addButtonActionText={"Add new region in which this race exist"}
            addExistingButtonActionText={"Link existing region to places where this race occures"}
            deleteButtonActionText={`Unlink this region from ${raceDTO.race?.name}`}
            subCategoryLinkText={"region"} />
    </OneEntryHeaderLayout>
}