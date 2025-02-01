import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useParams } from "react-router-dom";
import { PlaceControllerService, WorldDTO } from "../../../../../../services/openapi";
import useUserState from "../../../../../../services/storage/UserStorage";
import { DomCategoryBody } from "../../../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../../components/accordions/oneEntryHeaderLayout";
import { GetAllOfEntryFunctions } from "../../../../../globalFunctions/getAll/getAllOfEntry";
import { PlaceFunctionArray } from "../Functions/placeFunctionArrays";
import { PlaceFunctionDomObjects } from "../Functions/placeFunctionDomObjects";
import { UseOnePlaceFunction } from "../Functions/useOnePlaceFunction";


export function OnePlaceHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { placeName } = useParams<string>();
    const { status, data: placeDTO, error } = useQuery({
        queryKey: ["place", placeName],
        queryFn: async () => PlaceControllerService.getPlaceByName(placeName!)
    })
    const { getAllRegions } = GetAllOfEntryFunctions({ worldId: world.world?.id! })
    const { removePlace, editPlace } = UseOnePlaceFunction({ name: placeName!, worldName: world.world?.name! });
    const { saveImageToPlace, deleteImageFromPlace,
        addNewDesctiptionToPlace, updatePlaceDescription, deleteDescriptionFromPlace } = PlaceFunctionArray({ name: placeName! })
    const { setNewRegionToPlace, setExistingRegionToPlace, removeRegionFromPlaceFunction } = PlaceFunctionDomObjects({ name: placeName! });

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Place named {placeName} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this place"}
        deleteEntry={removePlace}
        updateEntry={editPlace} categoryName={"Place"}
        entryFullDTO={{
            object: placeDTO.object,
            images: placeDTO.images,
            descriptions: placeDTO.descriptions
        }} isAuthor={isAuthor}>
        <DomCategoryBody categoryName={"Region"} mainEntryId={placeDTO.object?.id!}
            descriptionOfConnectionString={"Region of"} descriptionOfNullConnectionString={"This place isn't linked to any region."}
            domObject={placeDTO.domObjects}
            domCategoryName={"Region"} domCategoryLink={"geography/regions"}
            fillTheListWithAllSubObjects={getAllRegions}
            setNewDomEntryToRelation={setNewRegionToPlace}
            addExistingObjectToRelation={setExistingRegionToPlace}
            deleteSubObject={removeRegionFromPlaceFunction}
            addButtonActionText={`Set new region to ${placeDTO.object?.name}`}
            deleteButtonActionText={`Unlink this place from region`}
            addExistingButtonActionText={`Set existing region to ${placeDTO.object?.name}`} isAuthor={isAuthor} />
        <FullEntryAccordionBody categoryName={"Place"} entryFullDTO={{
            object: placeDTO.object,
            images: placeDTO.images,
            descriptions: placeDTO.descriptions
        }}
            saveImageToEntry={saveImageToPlace}
            deleteImageFromEntry={deleteImageFromPlace}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToPlace}
            updateDescription={updatePlaceDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromPlace} isAuthor={isAuthor} />
    </OneEntryHeaderLayout>
}