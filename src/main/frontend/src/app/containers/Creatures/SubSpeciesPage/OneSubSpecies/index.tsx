import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../../globalFunctions/RegionHooks";

import { useQuery } from "@tanstack/react-query";
import { SubSpeciesControllerService } from "../../../../../services/openapi";
import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { SubSpeciesFunctionArray } from "../subSpeciesFunctionArrays";
import { SubSpeciesFunctionDomObjects } from "../subSpeciesFunctionDomObjects";
import { SubSpeciesFunctionSubObjects } from "../subSpeciesFunctionSubObjects";
import { UseOneSubSpeciesFunction } from "../../../WorldExtensions/CreatureHomePage/SubSpeciesHomePage/OneSubSpeciesHomePage/useOneSubSpeciesFunction";

export function OneSubSpecies() {
    let { name } = useParams();
    const { status, data: subSpeciesDTO, error } = useQuery({
        queryKey: ["subSpecies", name],
        queryFn: async () => SubSpeciesControllerService.getSubSpeciesByName(name!)
    })

    const { removeSubSpecies, editSubSpecies } = UseOneSubSpeciesFunction({ name: name! });
    const {saveImageToSubSpecies, deleteImageFromSubSpecies, addNewDesctiptionToSubSpecies, updateSubSpeciesDescription, deleteDescriptionFromSubSpecies} = SubSpeciesFunctionArray({ name: name! })
    const { saveNewRegionToSubSpecies, saveExistingRegionToSubSpecies, removeRegionFromSubSpeciesFunction } = SubSpeciesFunctionSubObjects({ name: name! });
    const { setNewSpeciesToSubSpecies, setExistingSpeciesToSubSpecies, removeSpeciesFromSubSpeciesFunction, getAllSpecies } = SubSpeciesFunctionDomObjects({ name: name! });

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Sub species named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this subspecies"}
        deleteEntry={removeSubSpecies}
        updateEntry={editSubSpecies} categoryName={"Subspecies"} entryFullDTO={{
            object: subSpeciesDTO.species,
            images: subSpeciesDTO.images,
            domObjects: subSpeciesDTO.species,
            subObjects: [],
            descriptions: subSpeciesDTO.descriptions
        }}>
        <DomCategoryBody categoryName={"Subspecies"} mainEntryId={subSpeciesDTO.subSpecies?.id!}
            descriptionOfConnectionString={"Subspecies of"} descriptionOfNullConnectionString={"This subspecies doesn't have main species."}
            domObject={subSpeciesDTO.species}
            domCategoryName={"Species"} domCategoryLink={"creatures/species"}
            fillTheListWithAllSubObjects={getAllSpecies}
            setNewDomEntryToRelation={setNewSpeciesToSubSpecies}
            addExistingObjectToRelation={setExistingSpeciesToSubSpecies}
            deleteSubObject={removeSpeciesFromSubSpeciesFunction}
            addButtonActionText={`Set new core species of ${subSpeciesDTO.subSpecies?.name}`}
            deleteButtonActionText={`Unset core species of ${subSpeciesDTO.subSpecies?.name}`}
            addExistingButtonActionText={`Set core species for ${subSpeciesDTO.subSpecies?.name} from list`} />
        <FullEntryAccordionBody categoryName={"SubSpecies"} entryFullDTO={{
            object: subSpeciesDTO.subSpecies,
            images: subSpeciesDTO.images,
            domObjects: {},
            subObjects: subSpeciesDTO.regions,
            descriptions: subSpeciesDTO.descriptions
        }}
            saveImageToEntry={saveImageToSubSpecies}
            deleteImageFromEntry={deleteImageFromSubSpecies}
            deleteImageButtonActionText={"Delete image"} 
            addNewDescriptionToEntry={addNewDesctiptionToSubSpecies} 
            updateDescription={updateSubSpeciesDescription} 
            deleteDescriptionFromEntry={deleteDescriptionFromSubSpecies} />
        <SubCategoryBody mainEntryId={subSpeciesDTO.subSpecies?.id!}
            subObjects={subSpeciesDTO.regions}
            subCategoryTitle={"Regions"} subCategoryLink={"regions"}
            fillTheListWithAllSubObjects={getAllRegions}
            addExistingObjectToRelation={saveExistingRegionToSubSpecies}
            deleteSubObject={removeRegionFromSubSpeciesFunction}
            addNewSubEntryToRelation={saveNewRegionToSubSpecies}
            addButtonActionText={"Add new region in which this subspecies exist"}
            addExistingButtonActionText={"Link existing region to places where this subspecies occures"}
            deleteButtonActionText={`Unlink this region from ${subSpeciesDTO.subSpecies?.name}`}
            subCategoryLinkText={"region"} />
    </OneEntryHeaderLayout>
}