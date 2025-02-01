import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useParams } from "react-router-dom";
import { ContinentControllerService, WorldDTO } from "../../../../../../services/openapi";
import useUserState from "../../../../../../services/storage/UserStorage";
import { DomCategoryBody } from "../../../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../../../components/accordions/fullEntryAccordionBody";
import { OneEntryHeaderLayout } from "../../../../../components/accordions/oneEntryHeaderLayout";
import { SubCategoryBody } from "../../../../../components/accordions/subCategoryBody";
import { ContinentFunctionArray } from "../Functions/continentFunctionArrays";
import { ContinentFunctionDomObjects } from "../Functions/continentFunctionDomObjects";
import { ContinentFunctionSubObjects } from "../Functions/continentFunctionSubObjects";
import { UseOneContinentFunction } from "../Functions/useOneContinentFunction";
import { GetAllOfEntryFunctions } from "../../../../../globalFunctions/getAll/getAllOfEntry";

export function OneContinent() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { continentName } = useParams<string>();
    const { status, data: continentDTO, error } = useQuery({
        queryKey: ["continent", continentName],
        queryFn: async () => ContinentControllerService.getContinentByName(continentName!)
    })
    const { getAllKingdoms, getAllRegionsWithoutContinent, getAllPlanes } = GetAllOfEntryFunctions({ worldId: world.world?.id! })
    const { removeContinent, editContinent } = UseOneContinentFunction({ name: continentName!, worldName: world.world?.name! });
    const { saveImageToContinent, deleteImageFromContinent,
        addNewDesctiptionToContinent, updateContinentDescription, deleteDescriptionFromContinent } = ContinentFunctionArray({ name: continentName! })
    const { saveNewKingdomToContinent, saveExistingKingdomToContinent, removeKingdomFromContinentFunction,
        removeRegionFromContinentFunction, saveNewRegionToContinent, saveExistingRegionToContinent } = ContinentFunctionSubObjects({ name: continentName! })
    const { setNewPlaneToContinent, setExistingPlaneToContinent, removePlaneFromContinentFunction } = ContinentFunctionDomObjects({ name: continentName! });

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Continent named {continentName} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <OneEntryHeaderLayout
        deleteMainObjectButtonActionText={"Delete this continent"}
        deleteEntry={removeContinent}
        updateEntry={editContinent} categoryName={"Continent"} entryFullDTO={{
            object: continentDTO.continent,
            images: continentDTO.images,
            descriptions: continentDTO.descriptions
        }} isAuthor={isAuthor}>
        <DomCategoryBody categoryName={"Plane"} mainEntryId={continentDTO.continent?.id!}
            descriptionOfConnectionString={"Plane of"} descriptionOfNullConnectionString={"This continent isn't linked to any plane."}
            domObject={continentDTO.plane}
            domCategoryName={"Plane"} domCategoryLink={"worlds/home/" + world.world?.name + "/geography/planes"}
            fillTheListWithAllSubObjects={getAllPlanes}
            setNewDomEntryToRelation={setNewPlaneToContinent}
            addExistingObjectToRelation={setExistingPlaneToContinent}
            deleteSubObject={removePlaneFromContinentFunction}
            addButtonActionText={`Set new plane to ${continentDTO.continent?.name}`}
            deleteButtonActionText={`Unlink this continent from plane`}
            addExistingButtonActionText={`Set existing plane to ${continentDTO.continent?.name}`} isAuthor={isAuthor} />
        <FullEntryAccordionBody categoryName={"Continent"} entryFullDTO={{
            object: continentDTO.continent,
            images: continentDTO.images,
            descriptions: continentDTO.descriptions
        }}
            saveImageToEntry={saveImageToContinent}
            deleteImageFromEntry={deleteImageFromContinent}
            deleteImageButtonActionText={"Delete image"}
            addNewDescriptionToEntry={addNewDesctiptionToContinent}
            updateDescription={updateContinentDescription}
            deleteDescriptionFromEntry={deleteDescriptionFromContinent} isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={continentDTO.continent?.id!}
            subObjects={continentDTO.regions}
            subCategoryTitle={"Regions"} subCategoryLink={"geography/regions"}
            fillTheListWithAllSubObjects={getAllRegionsWithoutContinent}
            addExistingObjectToRelation={saveExistingRegionToContinent}
            deleteSubObject={removeRegionFromContinentFunction}
            addNewSubEntryToRelation={saveNewRegionToContinent}
            addButtonActionText={`Add new region to ${continentDTO.continent?.name}`}
            addExistingButtonActionText={"Link existing region to this continent"}
            deleteButtonActionText={`Unlink this region from ${continentDTO.continent?.name}`}
            subCategoryLinkText={"region"} worldName={world.world?.name!}
            isAuthor={isAuthor} />
        <SubCategoryBody mainEntryId={continentDTO.continent?.id!}
            subObjects={continentDTO.kingdoms}
            subCategoryTitle={"Kingdoms"} subCategoryLink={"politics/kingdoms"}
            fillTheListWithAllSubObjects={getAllKingdoms}
            addExistingObjectToRelation={saveExistingKingdomToContinent}
            deleteSubObject={removeKingdomFromContinentFunction}
            addNewSubEntryToRelation={saveNewKingdomToContinent}
            addButtonActionText={"Add new kingdom to this continent"}
            addExistingButtonActionText={"Link existing kingdom to this continent"}
            deleteButtonActionText={`Unlink this kingdom from ${continentDTO.continent?.name}`}
            subCategoryLinkText={"kingdom"} worldName={world.world?.name!}
            isAuthor={isAuthor} />
    </OneEntryHeaderLayout>
}