import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useParams } from "react-router-dom";
import { PlaneControllerService, WorldDTO } from "../../../../../../services/openapi";
import useUserState from "../../../../../../services/storage/UserStorage";
import { FullEntryAccordionBody } from "../../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../../components/accordions/subCategoryBody";
import { PlaneFunctionArray } from "../Functions/planeFunctionArrays";
import { PlaneFunctionSubObjects } from "../Functions/planeFunctionSubObjects";
import { UseOnePlaneFunction } from "../Functions/useOnePlaneFunction";
import { GetAllOfEntryFunctions } from "../../../../../globalFunctions/getAll/getAllOfEntry";

export function OnePlaneHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { planeName } = useParams<string>();
    const { status, data: planeDTO, error } = useQuery({
        queryKey: ["plane", planeName],
        queryFn: async () => PlaneControllerService.getPlaneByName(planeName!)
    })
    const { getAllContinentsWithoutPlane, getAllCreatureTypes } = GetAllOfEntryFunctions({ worldId: world.world?.id! })
    const { removePlane, editPlane } = UseOnePlaneFunction({ name: planeName!, worldName: world.world?.name! });
    const { saveImageToPlane, deleteImageFromPlane,
        addNewDesctiptionToPlane, updatePlaneDescription, deleteDescriptionFromPlane } = PlaneFunctionArray({ name: planeName! })
    const { saveNewContinentToPlane, saveExistingContinentToPlane, removeContinentFromPlaneFunction,
        removeCreatureTypeFromPlaneFunction, saveNewCreatureTypeToPlane, saveExistingCreatureTypeToPlane
    } = PlaneFunctionSubObjects({ name: planeName! })
    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Plane named {planeName} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this plane"}
        deleteEntry={removePlane}
        updateEntry={editPlane} categoryName={"Plane"} entryFullDTO={{
            object: planeDTO.plane,
            images: planeDTO.images,
            descriptions: planeDTO.descriptions
        }} isAuthor={isAuthor}>
        <FullEntryAccordionBody categoryName={"Plane"} entryFullDTO={{
            object: planeDTO.plane,
            images: planeDTO.images,
            descriptions: planeDTO.descriptions
        }}
            saveImageToEntry={saveImageToPlane}
            deleteImageFromEntry={deleteImageFromPlane}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToPlane}
            updateDescription={updatePlaneDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromPlane} isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={planeDTO.plane?.id!}
            subObjects={planeDTO.continents}
            subCategoryTitle={"Continents"} subCategoryLink={"geography/continents"}
            fillTheListWithAllSubObjects={getAllContinentsWithoutPlane}
            addExistingObjectToRelation={saveExistingContinentToPlane}
            deleteSubObject={removeContinentFromPlaneFunction}
            addNewSubEntryToRelation={saveNewContinentToPlane}
            addButtonActionText={"Add new continent to this plane"}
            addExistingButtonActionText={"Link existing continent to this plane"}
            deleteButtonActionText={`Unlink this continent from ${planeDTO.plane?.name}`}
            subCategoryLinkText={"continent"} worldName={world.world?.name!}
            isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={planeDTO.plane?.id!}
            subObjects={planeDTO.creatureTypes}
            subCategoryTitle={"Creature types"} subCategoryLink={"creatures/types"}
            fillTheListWithAllSubObjects={getAllCreatureTypes}
            addExistingObjectToRelation={saveExistingCreatureTypeToPlane}
            deleteSubObject={removeCreatureTypeFromPlaneFunction}
            addNewSubEntryToRelation={saveNewCreatureTypeToPlane}
            addButtonActionText={`Add new creature type to ${planeDTO.plane?.name}`}
            addExistingButtonActionText={"Link existing creature type to this plane"}
            deleteButtonActionText={`Unlink this creature type from ${planeDTO.plane?.name}`}
            subCategoryLinkText={"creature type"} worldName={world.world?.name!}
            isAuthor={isAuthor} />
    </OneEntryHeaderLayout>
}