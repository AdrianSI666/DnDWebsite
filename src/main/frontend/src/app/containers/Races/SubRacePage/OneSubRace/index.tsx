import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../../globalFunctions/RegionHooks";

import { useQuery } from "@tanstack/react-query";
import { SubRaceControllerService } from "../../../../../services/openapi";
import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { SubRaceFunctionArray } from "../subRaceFunctionArrays";
import { SubRaceFunctionDomObjects } from "../subRaceFunctionDomObjects";
import { SubRaceFunctionSubObjects } from "../subRaceFunctionSubObjects";
import { UseOneSubRaceFunction } from "./useOneSubRaceFunction";

export function OneSubRace() {
    let { name } = useParams();
    const { status, data: subRaceDTO, error } = useQuery({
        queryKey: ["subRace", name],
        queryFn: async () => SubRaceControllerService.getSubRaceByName(name!)
    })

    const { removeSubRace, editSubRace } = UseOneSubRaceFunction({ name: name! });
    const {saveImageToSubRace, deleteImageFromSubRace, addNewDesctiptionToSubRace, updateSubRaceDescription, deleteDescriptionFromSubRace} = SubRaceFunctionArray({ name: name! })
    const { saveNewRegionToSubRace, saveExistingRegionToSubRace, removeRegionFromSubRaceFunction } = SubRaceFunctionSubObjects({ name: name! });
    const { setNewRaceToSubRace, setExistingRaceToSubRace, removeRaceFromSubRaceFunction, getAllRaces } = SubRaceFunctionDomObjects({ name: name! });

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Sub race named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this subrace"}
        deleteEntry={removeSubRace}
        updateEntry={editSubRace} categoryName={"Subrace"} entryFullDTO={{
            object: subRaceDTO.race,
            images: subRaceDTO.images,
            domObjects: subRaceDTO.race,
            subObjects: [],
            descriptions: subRaceDTO.descriptions
        }}>
        <DomCategoryBody categoryName={"Subrace"} mainEntryId={subRaceDTO.subRace?.id!}
            descriptionOfConnectionString={"Subrace of"} descriptionOfNullConnectionString={"This subrace doesn't have main race."}
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
            subObjects: subRaceDTO.regions,
            descriptions: subRaceDTO.descriptions
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
            addButtonActionText={"Add new region in which this subrace exist"}
            addExistingButtonActionText={"Link existing region to places where this subrace occures"}
            deleteButtonActionText={`Unlink this region from ${subRaceDTO.subRace?.name}`}
            subCategoryLinkText={"region"} />
    </OneEntryHeaderLayout>
}