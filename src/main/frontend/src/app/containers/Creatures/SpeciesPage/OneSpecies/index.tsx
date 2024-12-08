import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../../globalFunctions/RegionHooks";
import { UseOneSpeciesFunction } from "./useOneSpeciesFunction";
import { SpeciesControllerService } from "../../../../../services/openapi";
import { SpeciesFunctionArray } from "../speciesFunctionArrays";
import { SpeciesFunctionSubObjects } from "../speciesFunctionSubObjects";

export function OneSpecies() {
    let { name } = useParams();
    const { status, data: speciesDTO, error } = useQuery({
        queryKey: ["species", name],
        queryFn: async () => SpeciesControllerService.getSpeciesByName(name!)
    })

    const { removeSpecies, editSpecies } = UseOneSpeciesFunction({ name: name! });
    const { saveImageToSpecies, deleteImageFromSpecies,
        addNewDesctiptionToSpecies, updateSpeciesDescription, deleteDescriptionFromSpecies } = SpeciesFunctionArray({ name: name! })
    const { getAllSubSpecies, removeSubSpeciesFromSpeciesFunction, saveNewSubSpeciesToSpecies, saveExistingSubSpeciesToSpecies,
        saveNewRegionToSpecies, saveExistingRegionToSpecies, removeRegionFromSpeciesFunction } = SpeciesFunctionSubObjects({ name: name! })

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Species named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this species"}
        deleteEntry={removeSpecies}
        updateEntry={editSpecies} categoryName={"Species"} entryFullDTO={{
            object: speciesDTO.species,
            images: speciesDTO.images,
            domObjects: {},
            subObjects: speciesDTO.subSpecies,
            descriptions: speciesDTO.descriptions
        }}>
        <FullEntryAccordionBody categoryName={"Species"} entryFullDTO={{
            object: speciesDTO.species,
            images: speciesDTO.images,
            domObjects: {},
            subObjects: speciesDTO.subSpecies,
            descriptions: speciesDTO.descriptions
        }}
            saveImageToEntry={saveImageToSpecies}
            deleteImageFromEntry={deleteImageFromSpecies}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToSpecies}
            updateDescription={updateSpeciesDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromSpecies} />
        <SubCategoryBody mainEntryId={speciesDTO.species?.id!}
            subObjects={speciesDTO.subSpecies}
            subCategoryTitle={"Sub Species"} subCategoryLink={"creatures/subspecies"}
            fillTheListWithAllSubObjects={getAllSubSpecies}
            addNewSubEntryToRelation={saveNewSubSpeciesToSpecies}
            addExistingObjectToRelation={saveExistingSubSpeciesToSpecies}
            deleteSubObject={removeSubSpeciesFromSpeciesFunction}
            addButtonActionText={"Add new subspecies that originated from this species"}
            addExistingButtonActionText={"Link existing subspecies to this main species"}
            deleteButtonActionText={`Unlink this subspecies from ${speciesDTO.species?.name}`}
            subCategoryLinkText={"subspecies"} />
        <SubCategoryBody mainEntryId={speciesDTO.species?.id!}
            subObjects={speciesDTO.regions}
            subCategoryTitle={"Regions"} subCategoryLink={"regions"}
            fillTheListWithAllSubObjects={getAllRegions}
            addExistingObjectToRelation={saveExistingRegionToSpecies}
            deleteSubObject={removeRegionFromSpeciesFunction}
            addNewSubEntryToRelation={saveNewRegionToSpecies}
            addButtonActionText={"Add new region in which this species exist"}
            addExistingButtonActionText={"Link existing region to places where this species occures"}
            deleteButtonActionText={`Unlink this region from ${speciesDTO.species?.name}`}
            subCategoryLinkText={"region"} />
    </OneEntryHeaderLayout>
}