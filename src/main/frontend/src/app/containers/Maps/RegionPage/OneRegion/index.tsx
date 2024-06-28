import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { RegionControllerService } from "../../../../../services/openapi";
import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { RegionFunctionArray } from "../function/regionFunctionArrays";
import { RegionFunctionCultures } from "../function/regionFunctionCultures";
import { RegionFunctionKingdom } from "../function/regionFunctionKingdom";
import { RegionFunctionPlaces } from "../function/regionFunctionPlaces";
import { RegionFunctionRaces } from "../function/regionFunctionRaces";
import { RegionFunctionSubRaces } from "../function/regionFunctionSubRaces";
import { UseOneRegionFunction } from "./useOneRegionFunction";

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
    const { getAllKingdoms, removeKingdomFromRegionFunction, setNewKingdomToRegion, setExistingKingdomToRegion } =
        RegionFunctionKingdom({ name: regionDTO?.region!.name! });
    const { getAllCultures, removeCultureFromRegionFunction, saveNewCultureToRegion, saveExistingCultureToRegion } =
        RegionFunctionCultures({ name: regionDTO?.region!.name! });
    const { getAllRaces, removeRaceFromRegionFunction, saveNewRaceToRegion, saveExistingRaceToRegion } =
        RegionFunctionRaces({ name: regionDTO?.region!.name! });
    const { getAllSubRaces, removeSubRaceFromRegionFunction, saveNewSubRaceToRegion, saveExistingSubRaceToRegion } =
        RegionFunctionSubRaces({ name: regionDTO?.region!.name! });

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
            domObjects: regionDTO.kingdom,
            subObjects: regionDTO.places,
            descriptions: regionDTO.descriptions
        }}>
        <DomCategoryBody categoryName={"Region"} mainEntryId={regionDTO.region?.id!}
            descriptionOfConnectionString={"Kingdom of"} descriptionOfNullConnectionString={"This region isn't linked to any kingdom."}
            domObject={regionDTO.kingdom}
            domCategoryName={"Kingdom"} domCategoryLink={"kingdoms"}
            fillTheListWithAllSubObjects={getAllKingdoms}
            setNewDomEntryToRelation={setNewKingdomToRegion}
            addExistingObjectToRelation={setExistingKingdomToRegion}
            deleteSubObject={removeKingdomFromRegionFunction}
            addButtonActionText={`Set new kingdom to ${regionDTO.region?.name}`}
            deleteButtonActionText={`Unlink this region from kingdom`}
            addExistingButtonActionText={`Set existing kingdom to ${regionDTO.region?.name}`} />
        <FullEntryAccordionBody categoryName={"Region"} entryFullDTO={{
            object: regionDTO.region,
            images: regionDTO.images,
            domObjects: regionDTO.kingdom,
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
            subCategoryTitle={"Places"} subCategoryLink={"places"}
            fillTheListWithAllSubObjects={getAllPlacesWithoutRegion}
            addExistingObjectToRelation={saveExistingPlaceToRegion}
            deleteSubObject={removePlaceFromRegionFunction}
            addNewSubEntryToRelation={saveNewPlaceToRegion}
            addButtonActionText={`Add new place to ${regionDTO.region?.name}`}
            addExistingButtonActionText={"Link existing place to this region"}
            deleteButtonActionText={`Unlink this place from ${regionDTO.region?.name}`}
            subCategoryLinkText={"place"} />
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
            subObjects={regionDTO.races}
            subCategoryTitle={"Races"} subCategoryLink={"races"}
            fillTheListWithAllSubObjects={getAllRaces}
            addExistingObjectToRelation={saveExistingRaceToRegion}
            deleteSubObject={removeRaceFromRegionFunction}
            addNewSubEntryToRelation={saveNewRaceToRegion}
            addButtonActionText={`Add new race to ${regionDTO.region?.name}`}
            addExistingButtonActionText={"Link existing race to this region"}
            deleteButtonActionText={`Unlink this race from ${regionDTO.region?.name}`}
            subCategoryLinkText={"race"} />
        <SubCategoryBody mainEntryId={regionDTO.region?.id!}
            subObjects={regionDTO.subRaces}
            subCategoryTitle={"Sub races"} subCategoryLink={"subraces"}
            fillTheListWithAllSubObjects={getAllSubRaces}
            addExistingObjectToRelation={saveExistingSubRaceToRegion}
            deleteSubObject={removeSubRaceFromRegionFunction}
            addNewSubEntryToRelation={saveNewSubRaceToRegion}
            addButtonActionText={`Add new sub race to ${regionDTO.region?.name}`}
            addExistingButtonActionText={"Link existing sub race to this region"}
            deleteButtonActionText={`Unlink this sub race from ${regionDTO.region?.name}`}
            subCategoryLinkText={"sub race"} />
    </OneEntryHeaderLayout>
}