import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useParams } from "react-router-dom";
import { SubSpeciesControllerService, WorldDTO } from "../../../../../../services/openapi";
import useUserState from "../../../../../../services/storage/UserStorage";
import { FullEntryAccordionBody } from "../../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../../../globalFunctions/RegionHooks";
import { DomCategoryBody } from "../../../../../components/accordions/domCategoryBody";
import { SubSpeciesFunctionDomObjects } from "../../../../Creatures/SubSpeciesPage/subSpeciesFunctionDomObjects";
import { SubSpeciesFunctionSubObjects } from "../../../../Creatures/SubSpeciesPage/subSpeciesFunctionSubObjects";
import { UseOneSubSpeciesFunction } from "./useOneSubSpeciesFunction";
import { SubSpeciesFunctionArray } from "../../../../Creatures/SubSpeciesPage/subSpeciesFunctionArrays";


export function OneSubSpeciesHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { subSpeciesName } = useParams<string>();
    const { status, data: subSpecies, error } = useQuery({
        queryKey: ["subspecies", subSpeciesName],
        queryFn: async () => SubSpeciesControllerService.getSubSpeciesByName(subSpeciesName!)
    })
    const { removeSubSpecies, editSubSpecies } = UseOneSubSpeciesFunction({ name: subSpeciesName!, worldName: world.world?.name! })
    const { saveImageToSubSpecies, deleteImageFromSubSpecies,
        addNewDesctiptionToSubSpecies, updateSubSpeciesDescription, deleteDescriptionFromSubSpecies } = SubSpeciesFunctionArray({ name: subSpeciesName! })
    const { saveNewRegionToSubSpecies, saveExistingRegionToSubSpecies, removeRegionFromSubSpeciesFunction
    } = SubSpeciesFunctionSubObjects({ name: subSpeciesName! })
    const { setNewSpeciesToSubSpecies, setExistingSpeciesToSubSpecies, removeSpeciesFromSubSpeciesFunction, getAllSpecies } = SubSpeciesFunctionDomObjects({ name: subSpeciesName! });
    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Subspecies named {subSpeciesName} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this subspecies"}
        deleteEntry={removeSubSpecies}
        updateEntry={editSubSpecies} categoryName={"Subspecies"} entryFullDTO={{
            object: subSpecies.subSpecies,
            images: subSpecies.images,
            descriptions: subSpecies.descriptions
        }} isAuthor={isAuthor}>
        <FullEntryAccordionBody categoryName={"subspecies"} entryFullDTO={{
            object: subSpecies.subSpecies,
            images: subSpecies.images,
            descriptions: subSpecies.descriptions
        }}
            saveImageToEntry={saveImageToSubSpecies}
            deleteImageFromEntry={deleteImageFromSubSpecies}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToSubSpecies}
            updateDescription={updateSubSpeciesDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromSubSpecies} isAuthor={isAuthor} />
        <DomCategoryBody categoryName={"Species"} mainEntryId={subSpecies.subSpecies?.id!}
            descriptionOfConnectionString={"Species of"} descriptionOfNullConnectionString={"This subspecies doesn't have main species."}
            domObject={subSpecies.species}
            domCategoryName={"Species"}
            domCategoryLink={"worlds/home/" + world.world?.name + "/creatures/species"}
            fillTheListWithAllSubObjects={getAllSpecies}
            setNewDomEntryToRelation={setNewSpeciesToSubSpecies}
            addExistingObjectToRelation={setExistingSpeciesToSubSpecies}
            deleteSubObject={removeSpeciesFromSubSpeciesFunction}
            addButtonActionText={`Set new species of ${subSpecies.subSpecies?.name}`}
            deleteButtonActionText={`Unset species of ${subSpecies.subSpecies?.name}`}
            addExistingButtonActionText={`Set species for ${subSpecies.subSpecies?.name} from list`} isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={subSpecies.subSpecies?.id!}
            subObjects={subSpecies.regions}
            subCategoryTitle={"Region"} subCategoryLink={"geograpy/regions"}
            fillTheListWithAllSubObjects={getAllRegions}
            addNewSubEntryToRelation={saveNewRegionToSubSpecies}
            addExistingObjectToRelation={saveExistingRegionToSubSpecies}
            deleteSubObject={removeRegionFromSubSpeciesFunction}
            addButtonActionText={"Add new region on which this subsepcies exist"}
            addExistingButtonActionText={"Link existing region from list on which this subsepcies exist"}
            deleteButtonActionText={`Unlink this region from ${subSpecies.subSpecies?.name}`}
            subCategoryLinkText={"region"} isAuthor={isAuthor}
            worldName={world.world?.name!} />
    </OneEntryHeaderLayout>
}