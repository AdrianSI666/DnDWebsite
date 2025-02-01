import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useParams } from "react-router-dom";
import { SpeciesControllerService, WorldDTO } from "../../../../../../services/openapi";
import useUserState from "../../../../../../services/storage/UserStorage";
import { DomCategoryBody } from "../../../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../../components/accordions/subCategoryBody";
import { GetAllOfEntryFunctions } from "../../../../../globalFunctions/getAll/getAllOfEntry";
import { SpeciesFunctionArray } from "../Functions/speciesFunctionArrays";
import { SpeciesFunctionDomObjects } from "../Functions/speciesFunctionDomObjects";
import { SpeciesFunctionSubObjects } from "../Functions/speciesFunctionSubObjects";
import { UseOneSpeciesFunction } from "../Functions/useOneSpeciesFunction";


export function OneSpeciesHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { speciesName } = useParams<string>();
    const { status, data: species, error } = useQuery({
        queryKey: ["species", speciesName],
        queryFn: async () => SpeciesControllerService.getSpeciesByName(speciesName!)
    })
    const { getAllRegions, getAllCreatureTypes, getAllSubSpeciesWithoutSpecies } = GetAllOfEntryFunctions({ worldId: world.world?.id! })
    const { removeSpecies, editSpecies } = UseOneSpeciesFunction({ name: speciesName!, worldName: world.world?.name! })
    const { saveImageToSpecies, deleteImageFromSpecies,
        addNewDesctiptionToSpecies, updateSpeciesDescription, deleteDescriptionFromSpecies } = SpeciesFunctionArray({ name: speciesName! })
    const { saveNewSubSpeciesToSpecies, saveExistingSubSpeciesToSpecies, removeSubSpeciesFromSpeciesFunction,
        saveNewRegionToSpecies, saveExistingRegionToSpecies, removeRegionFromSpeciesFunction
    } = SpeciesFunctionSubObjects({ name: speciesName! })
    const { setNewCreatureTypeToSpecies, setExistingCreatureTypeToSpecies, removeCreatureTypeFromSpeciesFunction } = SpeciesFunctionDomObjects({ name: speciesName! });

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Species named {speciesName} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this species"}
        deleteEntry={removeSpecies}
        updateEntry={editSpecies} categoryName={"Species"} entryFullDTO={{
            object: species.species,
            images: species.images,
            descriptions: species.descriptions
        }} isAuthor={isAuthor}>
        <FullEntryAccordionBody categoryName={"species"} entryFullDTO={{
            object: species.species,
            images: species.images,
            descriptions: species.descriptions
        }}
            saveImageToEntry={saveImageToSpecies}
            deleteImageFromEntry={deleteImageFromSpecies}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToSpecies}
            updateDescription={updateSpeciesDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromSpecies} isAuthor={isAuthor} />
        <DomCategoryBody categoryName={"Creature type"} mainEntryId={species.species?.id!}
            descriptionOfConnectionString={"Creature type of"} descriptionOfNullConnectionString={"This species doesn't have a type."}
            domObject={species.creatureType}
            domCategoryName={"Creature type"}
            domCategoryLink={"worlds/home/" + world.world?.name + "/creatures/types"}
            fillTheListWithAllSubObjects={getAllCreatureTypes}
            setNewDomEntryToRelation={setNewCreatureTypeToSpecies}
            addExistingObjectToRelation={setExistingCreatureTypeToSpecies}
            deleteSubObject={removeCreatureTypeFromSpeciesFunction}
            addButtonActionText={`Set new creature type of ${species.species?.name}`}
            deleteButtonActionText={`Unset creature type of ${species.species?.name}`}
            addExistingButtonActionText={`Set creature type for ${species.species?.name} from list`} isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={species.species?.id!}
            subObjects={species.subSpecies}
            subCategoryTitle={"Subspecies"} subCategoryLink={"creatures/subspeciess"}
            fillTheListWithAllSubObjects={getAllSubSpeciesWithoutSpecies}
            addNewSubEntryToRelation={saveNewSubSpeciesToSpecies}
            addExistingObjectToRelation={saveExistingSubSpeciesToSpecies}
            deleteSubObject={removeSubSpeciesFromSpeciesFunction}
            addButtonActionText={"Add new subspecies that use this species"}
            addExistingButtonActionText={"Link existing subspecies from list to this species"}
            deleteButtonActionText={`Unlink this subspecies from ${species.species?.name}`}
            subCategoryLinkText={"subspecies"} isAuthor={isAuthor}
            worldName={world.world?.name!} />
        <SubCategoryBody mainEntryId={species.species?.id!}
            subObjects={species.regions}
            subCategoryTitle={"Region"} subCategoryLink={"geograpy/regions"}
            fillTheListWithAllSubObjects={getAllRegions}
            addNewSubEntryToRelation={saveNewRegionToSpecies}
            addExistingObjectToRelation={saveExistingRegionToSpecies}
            deleteSubObject={removeRegionFromSpeciesFunction}
            addButtonActionText={"Add new region that use this species"}
            addExistingButtonActionText={"Link existing region from list to this species"}
            deleteButtonActionText={`Unlink this region from ${species.species?.name}`}
            subCategoryLinkText={"region"} isAuthor={isAuthor}
            worldName={world.world?.name!} />
    </OneEntryHeaderLayout>
}