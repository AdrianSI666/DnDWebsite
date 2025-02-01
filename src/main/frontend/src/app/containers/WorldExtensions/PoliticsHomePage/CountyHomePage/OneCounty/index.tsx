import { useOutletContext, useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../../../components/accordions/subCategoryBody";
import { useQuery } from "@tanstack/react-query";
import { CountyControllerService, WorldDTO } from "../../../../../../services/openapi";
import useUserState from "../../../../../../services/storage/UserStorage";
import { DomCategoryBody } from "../../../../../components/accordions/domCategoryBody";
import { OneEntryHeaderLayout } from "../../../../../components/accordions/oneEntryHeaderLayout";
import { CountyFunctionArray } from "../Functions/countyFunctionArrays";
import { CountyFunctionDomObjects } from "../Functions/countyFunctionDomObjects";
import { CountyFunctionSubObjects } from "../Functions/countyFunctionSubObjects";
import { UseOneCountyFunction } from "../Functions/useOneCountyFunction";
import { GetAllOfEntryFunctions } from "../../../../../globalFunctions/getAll/getAllOfEntry";

export function OneCountyHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { countyName } = useParams<string>();
    const { status, data: countyDTO, error } = useQuery({
        queryKey: ["county", countyName],
        queryFn: async () => CountyControllerService.getCountyByName(countyName!)
    })
    const {getAllRegions, getAllKingdoms} = GetAllOfEntryFunctions({worldId: world.world?.id!})
    const { removeCounty, editCounty } = UseOneCountyFunction({ name: countyName!, worldName: world.world?.name! });
    const { saveImageToCounty, deleteImageFromCounty,
        addNewDesctiptionToCounty, updateCountyDescription, deleteDescriptionFromCounty } = CountyFunctionArray({ name: countyName! })
    const { saveExistingRegionToCounty, saveNewRegionToCounty, removeRegionFromCountyFunction } = CountyFunctionSubObjects({ name: countyName! })
    const { setNewKingdomToCounty, setExistingKingdomToCounty, removeKingdomFromCountyFunction } = CountyFunctionDomObjects({ name: countyName! });

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>County named {countyName} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this county"}
        deleteEntry={removeCounty}
        updateEntry={editCounty} categoryName={"County"}
        entryFullDTO={{
            object: countyDTO.object,
            images: countyDTO.images,
            descriptions: countyDTO.descriptions
        }} isAuthor={isAuthor}>
        <DomCategoryBody categoryName={"County"} mainEntryId={countyDTO.object?.id!}
            descriptionOfConnectionString={"Kingdom of"} descriptionOfNullConnectionString={"This county isn't linked to any kingdom."}
            domObject={countyDTO.domObjects}
            domCategoryName={"Kingdom"}
            domCategoryLink={"worlds/home/" + world.world?.name + "/politics/kingdoms"}
            fillTheListWithAllSubObjects={getAllKingdoms}
            setNewDomEntryToRelation={setNewKingdomToCounty}
            addExistingObjectToRelation={setExistingKingdomToCounty}
            deleteSubObject={removeKingdomFromCountyFunction}
            addButtonActionText={`Set new kingdom to ${countyDTO.object?.name}`}
            deleteButtonActionText={`Unlink this county from kingdom`}
            addExistingButtonActionText={`Set existing kingdom to ${countyDTO.object?.name}`}
            isAuthor={isAuthor} />
        <FullEntryAccordionBody categoryName={"County"} entryFullDTO={{
            object: countyDTO.object,
            images: countyDTO.images,
            descriptions: countyDTO.descriptions
        }}
            saveImageToEntry={saveImageToCounty}
            deleteImageFromEntry={deleteImageFromCounty}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToCounty}
            updateDescription={updateCountyDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromCounty} isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={countyDTO.object?.id!}
            subObjects={countyDTO.subObjects}
            subCategoryTitle={"Regions"} subCategoryLink={"regions"}
            fillTheListWithAllSubObjects={getAllRegions}
            addExistingObjectToRelation={saveExistingRegionToCounty}
            deleteSubObject={removeRegionFromCountyFunction}
            addNewSubEntryToRelation={saveNewRegionToCounty}
            addButtonActionText={"Add new region to this county"}
            addExistingButtonActionText={"Link existing region to this county"}
            deleteButtonActionText={`Unlink this region from ${countyDTO.object?.name}`}
            subCategoryLinkText={"region"} worldName={world.world?.name!}
            isAuthor={isAuthor} />
    </OneEntryHeaderLayout>
}