import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { RaceControllerService } from "../../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../../globalFunctions/RegionHooks";
import { RaceFunctionArray } from "../raceFunctionArrays";
import { RaceFunctionSubObjects } from "../raceFunctionSubObjects";
import { UseOneRaceObjectFunction } from "./useOneRaceObjectFunction";

export function OneRace() {
    let { name } = useParams();
    const { status, data: raceDTO, error } = useQuery({
        queryKey: ["race", name],
        queryFn: async () => RaceControllerService.getRaceByName(name!)
    })

    const { removeRace, editRace } = UseOneRaceObjectFunction({ name: name! });
    const { saveImageToRace, deleteImageFromRace,
        addNewDesctiptionToRace, updateRaceDescription, deleteDescriptionFromRace } = RaceFunctionArray({ name: name! })
    const { getAllSubRaces, removeSubRaceFromRaceFunction, saveNewSubRaceToRace, saveExistingSubRaceToRace,
        saveNewRegionToRace, saveExistingRegionToRace, removeRegionFromRaceFunction } = RaceFunctionSubObjects({ name: name! })

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
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
            fillTheListWithAllSubObjects={getAllSubRaces}
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