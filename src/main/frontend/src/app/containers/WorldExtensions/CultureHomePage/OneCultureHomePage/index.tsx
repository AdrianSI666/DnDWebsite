import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useParams } from "react-router-dom";
import { CultureControllerService, WorldDTO } from "../../../../../services/openapi";
import useUserState from "../../../../../services/storage/UserStorage";
import { FullEntryAccordionBody } from "../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../components/accordions/subCategoryBody";
import { GetAllOfEntryFunctions } from "../../../../globalFunctions/getAll/getAllOfEntry";
import { CultureFunctionArray } from "../Functions/cultureFunctionArrays";
import { CultureFunctionSubObjects } from "../Functions/cultureFunctionSubObjects";
import { UseOneCultureFunction } from "../Functions/useOneCultureFunction";


export function OneCultureHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { cultureName } = useParams<string>();
    const { status, data: culture, error } = useQuery({
        queryKey: ["culture", cultureName],
        queryFn: async () => CultureControllerService.getCultureByName(cultureName!)
    })
    const { removeCulture, editCulture } = UseOneCultureFunction({ name: cultureName!, worldName: world.world?.name! })
    const { saveImageToCulture, deleteImageFromCulture,
        addNewDesctiptionToCulture, updateCultureDescription, deleteDescriptionFromCulture } = CultureFunctionArray({ name: cultureName! })
    const { saveNewRegionToCulture, saveExistingRegionToCulture, removeRegionFromCultureFunction } = CultureFunctionSubObjects({ name: cultureName! })
    const { getAllRegions } = GetAllOfEntryFunctions({ worldId: world.world?.id! })
    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Culture named {cultureName} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this culture"}
        deleteEntry={removeCulture}
        updateEntry={editCulture} categoryName={"Culture"} entryFullDTO={{
            object: culture.object,
            images: culture.images,
            descriptions: culture.descriptions
        }} isAuthor={isAuthor}>
        <FullEntryAccordionBody categoryName={"culture"} entryFullDTO={{
            object: culture.object,
            images: culture.images,
            descriptions: culture.descriptions
        }}
            saveImageToEntry={saveImageToCulture}
            deleteImageFromEntry={deleteImageFromCulture}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToCulture}
            updateDescription={updateCultureDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromCulture} isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={culture.object?.id!}
            subObjects={culture.subObjects}
            subCategoryTitle={"Region"} subCategoryLink={"geograpy/regions"}
            fillTheListWithAllSubObjects={getAllRegions}
            addNewSubEntryToRelation={saveNewRegionToCulture}
            addExistingObjectToRelation={saveExistingRegionToCulture}
            deleteSubObject={removeRegionFromCultureFunction}
            addButtonActionText={"Add new region that use this culture"}
            addExistingButtonActionText={"Link existing region from list to this culture"}
            deleteButtonActionText={`Unlink this region from ${culture.object?.name}`}
            subCategoryLinkText={"region"} isAuthor={isAuthor} worldName={world.world?.name!} />
    </OneEntryHeaderLayout>
}