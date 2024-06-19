import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { CultureControllerService } from "../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../globalFunctions/RegionHooks";
import { CultureFunctionArray } from "../cultureFunctionArrays";
import { CultureFunctionSubObjects } from "../cultureFunctionSubObjects";
import { UseOneCultureFunction } from "./useOneCultureFunction";

export function OneCulture() {
    let { name } = useParams<string>();
    const { status, data: culture, error } = useQuery({
        queryKey: ["culture", name],
        queryFn: async () => CultureControllerService.getCultureByName(name!)
    })

    const { removeCulture, editCulture } = UseOneCultureFunction({ name: name! })
    const { saveImageToCulture, deleteImageFromCulture,
        addNewDesctiptionToCulture, updateCultureDescription, deleteDescriptionFromCulture } = CultureFunctionArray({ name: name! })
    const { saveNewRegionToCulture, saveExistingRegionToCulture, removeRegionFromCultureFunction } = CultureFunctionSubObjects({ name: name! })

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Culture named {name} doesn't exist.</h1>
    </div>;

    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this culture"}
        deleteEntry={removeCulture}
        updateEntry={editCulture} categoryName={"culture"} entryFullDTO={culture}>
        <FullEntryAccordionBody categoryName={"culture"} entryFullDTO={culture}
            saveImageToEntry={saveImageToCulture}
            deleteImageFromEntry={deleteImageFromCulture}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToCulture}
            updateDescription={updateCultureDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromCulture} />
        <SubCategoryBody mainEntryId={culture.object?.id!}
            subObjects={culture.subObjects}
            subCategoryTitle={"Region"} subCategoryLink={"regions"}
            fillTheListWithAllSubObjects={getAllRegions}
            addNewSubEntryToRelation={saveNewRegionToCulture}
            addExistingObjectToRelation={saveExistingRegionToCulture}
            deleteSubObject={removeRegionFromCultureFunction}
            addButtonActionText={"Add new region that use this culture"}
            addExistingButtonActionText={"Link existing region from list to this culture"}
            deleteButtonActionText={`Unlink this region from ${culture.object?.name}`}
            subCategoryLinkText={"region"} />
    </OneEntryHeaderLayout>
}