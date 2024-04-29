import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../../hookFunctions/RegionHooks";
import { useAppSelector } from "../../../../hooks";
import { OneRaceSubObjectsFunction } from "./oneRaceSubObjectsFunction";
import { makeSelectOneRace } from "./store/selector";
import { UseOneRaceObjectFunction } from "./useOneRaceObjectFunction";

interface IOneRaceProps {
}

const oneRaceSelect = createSelector(makeSelectOneRace, (raceDTO) => ({
    raceDTO
}))

export function OneRace(props: IOneRaceProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { raceDTO } = useAppSelector(oneRaceSelect);
    const { fetchRace, removeRace, editRace, saveImageToRace, deleteImageFromRace } = UseOneRaceObjectFunction({ raceId: raceDTO.race?.id });
    const { getAllSubRacesWithoutRace, removeSubRaceFromRaceFunction, saveNewSubRaceToRace, saveExistingSubRaceToRace, removeRegionFromRaceFunction, saveNewRegionToRace, saveExistingRegionToRace } = OneRaceSubObjectsFunction();

    useEffect(() => {
        fetchRace(name!).then((res) => setExist(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!exist) return <div>
        <h1>Race named {name} doesn't exist.</h1>
    </div>;

    return <div>
        <div className="d-grid gap-2">
            <h1>Race {name}</h1>
            <Accordion key={raceDTO.race?.id} defaultActiveKey={['0']}>
                <Accordion.Item eventKey={'0'} className="borderFix" onClick={(e) => e.stopPropagation()}>
                    <Accordion.Header>
                        <h5><b>{raceDTO.race?.name}</b></h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <FullEntryAccordionBody categoryName={"Race"} entryFullDTO={{
                            object: raceDTO.race,
                            images: raceDTO.images,
                            domObjects: {},
                            subObjects: raceDTO.subRaces
                        }}
                            deleteEntry={removeRace}
                            updateEntry={editRace}
                            saveImageToEntry={saveImageToRace}
                            deleteImageFromEntry={deleteImageFromRace}
                            deleteMainObjectButtonActionText={"Delete this race"}
                            deleteImageButtonActionText={"Delete image"} />
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
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    </div>
}