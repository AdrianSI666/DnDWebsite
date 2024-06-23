import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { PlaneControllerService } from "../../../../../services/openapi";
import { DomCategoryBody } from "../../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { PlaneFunctionArray } from "../planeFunctionArrays";
import { PlaneFunctionDomObjects } from "../planeFunctionDomObjects";
import { PlaneFunctionSubObjects } from "../planeFunctionSubObjects";
import { UseOnePlaneFunction } from "./useOnePlaneFunction";

export function OnePlane() {
    let { name } = useParams();
    const { status, data: planeDTO, error } = useQuery({
        queryKey: ["plane", name],
        queryFn: async () => PlaneControllerService.getPlaneByName(name!)
    })

    const { removePlane, editPlane } = UseOnePlaneFunction({ name: name! });
    const { saveImageToPlane, deleteImageFromPlane,
        addNewDesctiptionToPlane, updatePlaneDescription, deleteDescriptionFromPlane } = PlaneFunctionArray({ name: name! })
    const { getAllContinentsWithoutPlane, saveNewContinentToPlane, saveExistingContinentToPlane, removeContinentFromPlaneFunction } = PlaneFunctionSubObjects({ name: name! })
    const { setNewWorldToPlane, setExistingWorldToPlane, removeWorldFromPlaneFunction, getAllWorlds } = PlaneFunctionDomObjects({ name: name! });

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Plane named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this plane"}
        deleteEntry={removePlane}
        updateEntry={editPlane} categoryName={"Plane"} entryFullDTO={planeDTO}>
        <DomCategoryBody categoryName={"World"} mainEntryId={planeDTO.object?.id!}
            descriptionOfConnectionString={"World of"} descriptionOfNullConnectionString={"This plane isn't linked to any world."}
            domObject={planeDTO.domObjects}
            domCategoryName={"World"} domCategoryLink={"worlds"}
            fillTheListWithAllSubObjects={getAllWorlds}
            setNewDomEntryToRelation={setNewWorldToPlane}
            addExistingObjectToRelation={setExistingWorldToPlane}
            deleteSubObject={removeWorldFromPlaneFunction}
            addButtonActionText={`Set new world to ${planeDTO.object?.name}`}
            deleteButtonActionText={`Unlink this plane from world`}
            addExistingButtonActionText={`Set existing world to ${planeDTO.object?.name}`} />
        <FullEntryAccordionBody categoryName={"Plane"} entryFullDTO={planeDTO}
            saveImageToEntry={saveImageToPlane}
            deleteImageFromEntry={deleteImageFromPlane}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToPlane}
            updateDescription={updatePlaneDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromPlane} />
        <SubCategoryBody mainEntryId={planeDTO.object?.id!}
            subObjects={planeDTO.subObjects}
            subCategoryTitle={"Continents"} subCategoryLink={"continents"}
            fillTheListWithAllSubObjects={getAllContinentsWithoutPlane}
            addExistingObjectToRelation={saveExistingContinentToPlane}
            deleteSubObject={removeContinentFromPlaneFunction}
            addNewSubEntryToRelation={saveNewContinentToPlane}
            addButtonActionText={"Add new continent to this plane"}
            addExistingButtonActionText={"Link existing continent to this plane"}
            deleteButtonActionText={`Unlink this continent from ${planeDTO.object?.name}`}
            subCategoryLinkText={"continent"} />
    </OneEntryHeaderLayout>
}