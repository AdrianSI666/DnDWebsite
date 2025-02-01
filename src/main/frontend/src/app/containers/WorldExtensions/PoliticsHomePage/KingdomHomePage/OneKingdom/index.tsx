import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useParams } from "react-router-dom";
import { KingdomControllerService, WorldDTO } from "../../../../../../services/openapi";
import useUserState from "../../../../../../services/storage/UserStorage";
import { FullEntryAccordionBody } from "../../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../../components/accordions/subCategoryBody";
import { KingdomFunctionArray } from "../Functions/kingdomFunctionArrays";
import { KingdomFunctionSubObjects } from "../Functions/kingdomFunctionSubObjects";
import { UseOneKingdomFunction } from "../Functions/useOneKingdomFunction";
import { GetAllOfEntryFunctions } from "../../../../../globalFunctions/getAll/getAllOfEntry";

export function OneKingdomHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { kingdomName } = useParams<string>();
    const { status, data: kingdomDTO, error } = useQuery({
        queryKey: ["kingdom", kingdomName],
        queryFn: async () => KingdomControllerService.getKingdomByName(kingdomName!)
    })
    const { getAllCountiesWithoutKingdom, getAllContinents } = GetAllOfEntryFunctions({ worldId: world.world?.id! })
    const { removeKingdom, editKingdom } = UseOneKingdomFunction({ name: kingdomName!, worldName: world.world?.name! });
    const { saveImageToKingdom, deleteImageFromKingdom,
        addNewDesctiptionToKingdom, updateKingdomDescription, deleteDescriptionFromKingdom } = KingdomFunctionArray({ name: kingdomName! })
    const {
        saveExistingCountyToKingdom, removeCountyFromKingdomFunction, saveNewCountyToKingdom,
        saveNewContinentToKingdom, saveExistingContinentToKingdom, removeContinentFromKingdomFunction } = KingdomFunctionSubObjects({ name: kingdomName!, worldId: world.world?.id! })

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Kingdom named {kingdomName} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this kingdom"}
        deleteEntry={removeKingdom}
        updateEntry={editKingdom} categoryName={"Kingdom"}
        entryFullDTO={{
            object: kingdomDTO.object,
            images: kingdomDTO.images,
            descriptions: kingdomDTO.descriptions
        }} isAuthor={isAuthor}>
        <FullEntryAccordionBody categoryName={"Kingdom"} entryFullDTO={{
            object: kingdomDTO.object,
            images: kingdomDTO.images,
            descriptions: kingdomDTO.descriptions
        }}
            saveImageToEntry={saveImageToKingdom}
            deleteImageFromEntry={deleteImageFromKingdom}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToKingdom}
            updateDescription={updateKingdomDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromKingdom} isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={kingdomDTO.object?.id!}
            subObjects={kingdomDTO.counties}
            subCategoryTitle={"Counties"} subCategoryLink={"/politics/counties"}
            fillTheListWithAllSubObjects={getAllCountiesWithoutKingdom}
            addExistingObjectToRelation={saveExistingCountyToKingdom}
            deleteSubObject={removeCountyFromKingdomFunction}
            addNewSubEntryToRelation={saveNewCountyToKingdom}
            addButtonActionText={`Add new county to ${kingdomDTO.object?.name}`}
            addExistingButtonActionText={"Link existing county to this kingdom"}
            deleteButtonActionText={`Unlink this county from ${kingdomDTO.object?.name}`}
            subCategoryLinkText={"county"} worldName={world.world?.name!}
            isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={kingdomDTO.object?.id!}
            subObjects={kingdomDTO.continents}
            subCategoryTitle={"Continents"} subCategoryLink={"geograpy/continents"}
            fillTheListWithAllSubObjects={getAllContinents}
            addExistingObjectToRelation={saveExistingContinentToKingdom}
            deleteSubObject={removeContinentFromKingdomFunction}
            addNewSubEntryToRelation={saveNewContinentToKingdom}
            addButtonActionText={`Add new continent to ${kingdomDTO.object?.name}`}
            addExistingButtonActionText={"Link existing continent to this kingdom"}
            deleteButtonActionText={`Unlink this continent from ${kingdomDTO.object?.name}`}
            subCategoryLinkText={"continent"} worldName={world.world?.name!}
            isAuthor={isAuthor} />
    </OneEntryHeaderLayout>
}