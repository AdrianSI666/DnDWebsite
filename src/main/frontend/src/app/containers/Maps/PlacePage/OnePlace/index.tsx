import { useParams } from "react-router-dom";
import { PlaceControllerService } from "../../../../../services/openapi";
import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { PlaceFunctionArray } from "../function/placeFunctionArrays";
import { PlaceFunctionDomObjects } from "../function/placeFunctionDomObjects";
import { UseOnePlaceFunction } from "./useOnePlaceFunction";
import { useQuery } from "@tanstack/react-query";


export function OnePlace() {
    let { name } = useParams();
    const { status, data: placeDTO, error } = useQuery({
        queryKey: ["place", name],
        queryFn: async () => PlaceControllerService.getPlaceByName(name!)
    })

    const { removePlace, editPlace } = UseOnePlaceFunction({ name: name! });
    const { saveImageToPlace, deleteImageFromPlace,
        addNewDesctiptionToPlace, updatePlaceDescription, deleteDescriptionFromPlace } = PlaceFunctionArray({ name: name! })
    const { setNewRegionToPlace, setExistingRegionToPlace, removeRegionFromPlaceFunction, getAllRegions } = PlaceFunctionDomObjects({ name: name! });

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Place named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this place"}
        deleteEntry={removePlace}
        updateEntry={editPlace} categoryName={"Place"}
        entryFullDTO={placeDTO}>
        <DomCategoryBody categoryName={"Region"} mainEntryId={placeDTO.object?.id!}
            descriptionOfConnectionString={"Region of"} descriptionOfNullConnectionString={"This place isn't linked to any region."}
            domObject={placeDTO.domObjects}
            domCategoryName={"Region"} domCategoryLink={"regions"}
            fillTheListWithAllSubObjects={getAllRegions}
            setNewDomEntryToRelation={setNewRegionToPlace}
            addExistingObjectToRelation={setExistingRegionToPlace}
            deleteSubObject={removeRegionFromPlaceFunction}
            addButtonActionText={`Set new region to ${placeDTO.object?.name}`}
            deleteButtonActionText={`Unlink this place from region`}
            addExistingButtonActionText={`Set existing region to ${placeDTO.object?.name}`} />
        <FullEntryAccordionBody categoryName={"Place"} entryFullDTO={placeDTO}
            saveImageToEntry={saveImageToPlace}
            deleteImageFromEntry={deleteImageFromPlace}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToPlace}
            updateDescription={updatePlaceDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromPlace} />
    </OneEntryHeaderLayout>
}