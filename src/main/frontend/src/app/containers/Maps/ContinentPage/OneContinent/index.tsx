import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ContinentControllerService } from "../../../../../services/openapi";
import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { ContinentFunctionArray } from "../continentFunctionArrays";
import { ContinentFunctionDomObjects } from "../continentFunctionDomObjects";
import { ContinentFunctionSubObjects } from "../continentFunctionSubObjects";
import { UseOneContinentFunction } from "./useOneContinentFunction";

export function OneContinent() {
    let { name } = useParams();
    const { status, data: continentDTO, error } = useQuery({
        queryKey: ["continent", name],
        queryFn: async () => ContinentControllerService.getContinentByName(name!)
    })

    const { removeContinent, editContinent } = UseOneContinentFunction({ name: name! });
    const { saveImageToContinent, deleteImageFromContinent,
        addNewDesctiptionToContinent, updateContinentDescription, deleteDescriptionFromContinent } = ContinentFunctionArray({ name: name! })
    const { getAllKingdomsWithoutContinent, saveNewKingdomToContinent, saveExistingKingdomToContinent, removeKingdomFromContinentFunction } = ContinentFunctionSubObjects({ name: name! })
    const { setNewPlaneToContinent, setExistingPlaneToContinent, removePlaneFromContinentFunction, getAllPlanes } = ContinentFunctionDomObjects({ name: name! });

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Continent named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this continent"}
        deleteEntry={removeContinent}
        updateEntry={editContinent} categoryName={"Continent"} entryFullDTO={continentDTO}>
        <DomCategoryBody categoryName={"Plane"} mainEntryId={continentDTO.object?.id!}
            descriptionOfConnectionString={"Plane of"} descriptionOfNullConnectionString={"This continent isn't linked to any plane."}
            domObject={continentDTO.domObjects}
            domCategoryName={"Plane"} domCategoryLink={"planes"}
            fillTheListWithAllSubObjects={getAllPlanes}
            setNewDomEntryToRelation={setNewPlaneToContinent}
            addExistingObjectToRelation={setExistingPlaneToContinent}
            deleteSubObject={removePlaneFromContinentFunction}
            addButtonActionText={`Set new plane to ${continentDTO.object?.name}`}
            deleteButtonActionText={`Unlink this continent from plane`}
            addExistingButtonActionText={`Set existing plane to ${continentDTO.object?.name}`} />
        <FullEntryAccordionBody categoryName={"Continent"} entryFullDTO={continentDTO}
            saveImageToEntry={saveImageToContinent}
            deleteImageFromEntry={deleteImageFromContinent}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToContinent}
            updateDescription={updateContinentDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromContinent} />
        <SubCategoryBody mainEntryId={continentDTO.object?.id!}
            subObjects={continentDTO.subObjects}
            subCategoryTitle={"Kingdoms"} subCategoryLink={"kingdoms"}
            fillTheListWithAllSubObjects={getAllKingdomsWithoutContinent}
            addExistingObjectToRelation={saveExistingKingdomToContinent}
            deleteSubObject={removeKingdomFromContinentFunction}
            addNewSubEntryToRelation={saveNewKingdomToContinent}
            addButtonActionText={"Add new kingdom to this continent"}
            addExistingButtonActionText={"Link existing kingdom to this continent"}
            deleteButtonActionText={`Unlink this kingdom from ${continentDTO.object?.name}`}
            subCategoryLinkText={"kingdom"} />
    </OneEntryHeaderLayout>
}