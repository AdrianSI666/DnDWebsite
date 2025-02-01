import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useParams } from "react-router-dom";
import { RegionControllerService, WorldDTO } from "../../../../../../services/openapi";
import useUserState from "../../../../../../services/storage/UserStorage";
import { DomCategoryBody } from "../../../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../../components/accordions/subCategoryBody";
import { GetAllOfEntryFunctions } from "../../../../../globalFunctions/getAll/getAllOfEntry";
import { RegionFunctionArray } from "../Functions/regionFunctionArrays";
import { RegionFunctionContinent } from "../Functions/regionFunctionContinent";
import { RegionFunctionCounties } from "../Functions/regionFunctionCounties";
import { RegionFunctionCultures } from "../Functions/regionFunctionCultures";
import { RegionFunctionPlaces } from "../Functions/regionFunctionPlaces";
import { RegionFunctionSpecies } from "../Functions/regionFunctionSpecies";
import { RegionFunctionSubSpecies } from "../Functions/regionFunctionSubSpecies";
import { UseOneRegionFunction } from "../Functions/useOneRegionFunction";

export function OneRegionHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { regionName } = useParams<string>();
    const { status, data: regionDTO, error } = useQuery({
        queryKey: ["region", regionName],
        queryFn: async () => RegionControllerService.getRegionByName(regionName!)
    })
    const { getAllPlacesWithoutRegion, getAllCultures, getAllContinents, getAllSpecies, getAllSubSpecies, getAllCounties } = GetAllOfEntryFunctions({ worldId: world.world?.id! })
    const { removeRegion, editRegion } = UseOneRegionFunction({ name: regionName!, worldName: world.world?.name! });
    const { saveImageToRegion, deleteImageFromRegion, addNewDesctiptionToRegion, updateRegionDescription, deleteDescriptionFromRegion } =
        RegionFunctionArray({ name: regionName! });
    const { removePlaceFromRegionFunction, saveNewPlaceToRegion, saveExistingPlaceToRegion } =
        RegionFunctionPlaces({ name: regionName! });
    const { removeCultureFromRegionFunction, saveNewCultureToRegion, saveExistingCultureToRegion } =
        RegionFunctionCultures({ name: regionName! });

    const { removeContinentFromRegionFunction, setNewContinentToRegion, setExistingContinentToRegion } =
        RegionFunctionContinent({ name: regionName! });
    const { removeSpeciesFromRegionFunction, saveNewSpeciesToRegion, saveExistingSpeciesToRegion } =
        RegionFunctionSpecies({ name: regionName! });
    const { removeSubSpeciesFromRegionFunction, saveNewSubSpeciesToRegion, saveExistingSubSpeciesToRegion } =
        RegionFunctionSubSpecies({ name: regionName! });
    const { removeCountyFromRegionFunction, saveNewCountyToRegion, saveExistingCountyToRegion } =
        RegionFunctionCounties({ name: regionName! });
    if (error) return <div>
        <h1>Region named {regionName} doesn't exist.</h1>
    </div>;
    if (status === "pending") return <div>Loading...</div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this region"}
        deleteEntry={removeRegion}
        updateEntry={editRegion} categoryName={"Region"} entryFullDTO={{
            object: regionDTO.region,
            images: regionDTO.images,
            domObjects: regionDTO.continent,
            subObjects: regionDTO.places,
            descriptions: regionDTO.descriptions
        }} isAuthor={isAuthor}>
        <DomCategoryBody categoryName={"Region"} mainEntryId={regionDTO.region?.id!}
            descriptionOfConnectionString={"Continent of"} descriptionOfNullConnectionString={"This region isn't linked to any continent."}
            domObject={regionDTO.continent}
            domCategoryName={"Continent"} domCategoryLink={"worlds/home/" + world.world?.name + "/geography/continents"}
            fillTheListWithAllSubObjects={getAllContinents}
            setNewDomEntryToRelation={setNewContinentToRegion}
            addExistingObjectToRelation={setExistingContinentToRegion}
            deleteSubObject={removeContinentFromRegionFunction}
            addButtonActionText={`Set new continent to ${regionDTO.region?.name}`}
            deleteButtonActionText={`Unlink this region from continent`}
            addExistingButtonActionText={`Set existing continent to ${regionDTO.region?.name}`} isAuthor={isAuthor} />
        <FullEntryAccordionBody categoryName={"Region"} entryFullDTO={{
            object: regionDTO.region,
            images: regionDTO.images,
            domObjects: regionDTO.continent,
            subObjects: regionDTO.places,
            descriptions: regionDTO.descriptions
        }}
            saveImageToEntry={saveImageToRegion}
            deleteImageFromEntry={deleteImageFromRegion}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToRegion}
            updateDescription={updateRegionDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromRegion} isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={regionDTO.region?.id!}
            subObjects={regionDTO.places}
            subCategoryTitle={"Places"} subCategoryLink={"geography/places"}
            fillTheListWithAllSubObjects={getAllPlacesWithoutRegion}
            addExistingObjectToRelation={saveExistingPlaceToRegion}
            deleteSubObject={removePlaceFromRegionFunction}
            addNewSubEntryToRelation={saveNewPlaceToRegion}
            addButtonActionText={`Add new place to ${regionDTO.region?.name}`}
            addExistingButtonActionText={"Link existing place to this region"}
            deleteButtonActionText={`Unlink this place from ${regionDTO.region?.name}`}
            subCategoryLinkText={"geography/place"} worldName={world.world?.name!}
            isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={regionDTO.region?.id!}
            subObjects={regionDTO.cultures}
            subCategoryTitle={"Cultures"} subCategoryLink={"cultures"}
            fillTheListWithAllSubObjects={getAllCultures}
            addExistingObjectToRelation={saveExistingCultureToRegion}
            deleteSubObject={removeCultureFromRegionFunction}
            addNewSubEntryToRelation={saveNewCultureToRegion}
            addButtonActionText={`Add new culture to ${regionDTO.region?.name}`}
            addExistingButtonActionText={"Link existing culture to this region"}
            deleteButtonActionText={`Unlink this culture from ${regionDTO.region?.name}`}
            subCategoryLinkText={"culture"} worldName={world.world?.name!}
            isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={regionDTO.region?.id!}
            subObjects={regionDTO.species}
            subCategoryTitle={"Species"} subCategoryLink={"creatures/species"}
            fillTheListWithAllSubObjects={getAllSpecies}
            addExistingObjectToRelation={saveExistingSpeciesToRegion}
            deleteSubObject={removeSpeciesFromRegionFunction}
            addNewSubEntryToRelation={saveNewSpeciesToRegion}
            addButtonActionText={`Add new species to ${regionDTO.region?.name}`}
            addExistingButtonActionText={"Link existing species to this region"}
            deleteButtonActionText={`Unlink this species from ${regionDTO.region?.name}`}
            subCategoryLinkText={"creatures/species"} worldName={world.world?.name!}
            isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={regionDTO.region?.id!}
            subObjects={regionDTO.subSpecies}
            subCategoryTitle={"Sub species"} subCategoryLink={"creatures/subspecies"}
            fillTheListWithAllSubObjects={getAllSubSpecies}
            addExistingObjectToRelation={saveExistingSubSpeciesToRegion}
            deleteSubObject={removeSubSpeciesFromRegionFunction}
            addNewSubEntryToRelation={saveNewSubSpeciesToRegion}
            addButtonActionText={`Add new subspecies to ${regionDTO.region?.name}`}
            addExistingButtonActionText={"Link existing subspecies to this region"}
            deleteButtonActionText={`Unlink this subspecies from ${regionDTO.region?.name}`}
            subCategoryLinkText={"creatures/subspecies"} worldName={world.world?.name!}
            isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={regionDTO.region?.id!}
            subObjects={regionDTO.counties}
            subCategoryTitle={"Counties"} subCategoryLink={"politics/counties"}
            fillTheListWithAllSubObjects={getAllCounties}
            addExistingObjectToRelation={saveExistingCountyToRegion}
            deleteSubObject={removeCountyFromRegionFunction}
            addNewSubEntryToRelation={saveNewCountyToRegion}
            addButtonActionText={`Add new county to ${regionDTO.region?.name}`}
            addExistingButtonActionText={"Link existing county to this region"}
            deleteButtonActionText={`Unlink this county from ${regionDTO.region?.name}`}
            subCategoryLinkText={"politics/counties"} worldName={world.world?.name!}
            isAuthor={isAuthor} />
    </OneEntryHeaderLayout>
}