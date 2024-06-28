import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { WorldControllerService } from "../../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { WorldFunctionArray } from "../worldFunctionArrays";
import { WorldFunctionSubObjects } from "../worldFunctionSubObjects";
import { UseOneWorldFunction } from "./useOneWorldFunction";

export function OneWorld() {
    let { name } = useParams();
    const { status, data: worldDTO, error } = useQuery({
        queryKey: ["world", name],
        queryFn: async () => WorldControllerService.getWorldByName(name!)
    })

    const { removeWorld, editWorld } = UseOneWorldFunction({ name: name! });
    const { saveImageToWorld, deleteImageFromWorld,
        addNewDesctiptionToWorld, updateWorldDescription, deleteDescriptionFromWorld } = WorldFunctionArray({ name: name! })
    const { getAllPlanesWithoutWorld, saveNewPlaneToWorld, saveExistingPlaneToWorld, removePlaneFromWorldFunction } = WorldFunctionSubObjects({ name: name! })

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>World named {name} doesn't exist.</h1>
    </div>;


    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this world"}
        deleteEntry={removeWorld}
        updateEntry={editWorld} categoryName={"World"} entryFullDTO={worldDTO}>
        <FullEntryAccordionBody categoryName={"World"} entryFullDTO={worldDTO}
            saveImageToEntry={saveImageToWorld}
            deleteImageFromEntry={deleteImageFromWorld}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToWorld}
            updateDescription={updateWorldDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromWorld} />
        <SubCategoryBody mainEntryId={worldDTO.object?.id!}
            subObjects={worldDTO.subObjects}
            subCategoryTitle={"Planes"} subCategoryLink={"planes"}
            fillTheListWithAllSubObjects={getAllPlanesWithoutWorld}
            addNewSubEntryToRelation={saveNewPlaneToWorld}
            addExistingObjectToRelation={saveExistingPlaneToWorld}
            deleteSubObject={removePlaneFromWorldFunction}
            addButtonActionText={`Add new plane that exist on ${worldDTO.object?.name}`}
            addExistingButtonActionText={"Link existing plane to this world"}
            deleteButtonActionText={`Unlink this plane from ${worldDTO.object?.name}`}
            subCategoryLinkText={"plane"} />
    </OneEntryHeaderLayout>
}