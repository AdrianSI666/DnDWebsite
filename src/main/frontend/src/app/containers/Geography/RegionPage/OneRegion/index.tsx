import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { RegionControllerService } from "../../../../../services/openapi";
import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { RegionFunctionArray } from "../function/regionFunctionArrays";
import { RegionFunctionCultures } from "../function/regionFunctionCultures";
import { RegionFunctionPlaces } from "../function/regionFunctionPlaces";
import { UseOneRegionFunction } from "./useOneRegionFunction";
import { RegionFunctionContinent } from "../function/regionFunctionContinent";
import { RegionFunctionCounties } from "../function/regionFunctionCounties";
import { RegionFunctionSpecies } from "../function/regionFunctionSpecies";
import { RegionFunctionSubSpecies } from "../function/regionFunctionSubSpecies";

export function OneRegion() {
    let { name } = useParams();
    const { status, data: regionDTO, error } = useQuery({
        queryKey: ["region", name],
        queryFn: async () => RegionControllerService.getRegionByName(name!)
    })

    const { removeRegion, editRegion } = UseOneRegionFunction({ name: name! });
    const { saveImageToRegion, deleteImageFromRegion, addNewDesctiptionToRegion, updateRegionDescription, deleteDescriptionFromRegion } =
        RegionFunctionArray({ name: regionDTO?.region!.name! });
    const { getAllPlacesWithoutRegion, removePlaceFromRegionFunction, saveNewPlaceToRegion, saveExistingPlaceToRegion } =
        RegionFunctionPlaces({ name: regionDTO?.region!.name! });
    const { getAllCultures, removeCultureFromRegionFunction, saveNewCultureToRegion, saveExistingCultureToRegion } =
        RegionFunctionCultures({ name: regionDTO?.region!.name! });

    const { getAllContinents, removeContinentFromRegionFunction, setNewContinentToRegion, setExistingContinentToRegion } =
        RegionFunctionContinent({ name: regionDTO?.region!.name! });
    const { getAllSpecies, removeSpeciesFromRegionFunction, saveNewSpeciesToRegion, saveExistingSpeciesToRegion } =
        RegionFunctionSpecies({ name: regionDTO?.region!.name! });
    const { getAllSubSpecies, removeSubSpeciesFromRegionFunction, saveNewSubSpeciesToRegion, saveExistingSubSpeciesToRegion } =
        RegionFunctionSubSpecies({ name: regionDTO?.region!.name! });
    const { getAllCounties, removeCountyFromRegionFunction, saveNewCountyToRegion, saveExistingCountyToRegion } =
        RegionFunctionCounties({ name: regionDTO?.region!.name! });
    if (error) return <div>
        <h1>Region named {name} doesn't exist.</h1>
    </div>;
    if (status === "pending") return <div>Loading...</div>;
    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this region"}
        deleteEntry={removeRegion}
        updateEntry={editRegion} categoryName={"Region"} entryFullDTO={{
            object: regionDTO.region,
            images: regionDTO.images,
            domObjects: regionDTO.continent,
            subObjects: regionDTO.places,
            descriptions: regionDTO.descriptions
        }}>
        <DomCategoryBody categoryName={"Region"} mainEntryId={regionDTO.region?.id!}
            descriptionOfConnectionString={"Continent of"} descriptionOfNullConnectionString={"This region isn't linked to any continent."}
            domObject={regionDTO.continent}
            domCategoryName={"Continent"} domCategoryLink={"geography/continents"}
            fillTheListWithAllSubObjects={getAllContinents}
            setNewDomEntryToRelation={setNewContinentToRegion}
            addExistingObjectToRelation={setExistingContinentToRegion}
            deleteSubObject={removeContinentFromRegionFunction}
            addButtonActionText={`Set new continent to ${regionDTO.region?.name}`}
            deleteButtonActionText={`Unlink this region from continent`}
            addExistingButtonActionText={`Set existing continent to ${regionDTO.region?.name}`} />
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
            deleteDescriptionFromEntry={deleteDescriptionFromRegion} />
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
            subCategoryLinkText={"geography/place"} />
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
            subCategoryLinkText={"culture"} />
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
            subCategoryLinkText={"creatures/species"} />
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
            subCategoryLinkText={"creatures/subspecies"} />
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
            subCategoryLinkText={"politics/counties"} />
    </OneEntryHeaderLayout>
}