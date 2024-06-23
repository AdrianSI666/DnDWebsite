import { useQuery } from "@tanstack/react-query";
import { Accordion } from "react-bootstrap";
import { RegionControllerService, RegionDTO } from "../../../../services/openapi";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { RegionFunction } from "./function/regionFunction";
import { RegionFunctionPlaces } from "./function/regionFunctionPlaces";
import { useState } from "react";
import { RegionFunctionArray } from "./function/regionFunctionArrays";
import { RegionFunctionKingdom } from "./function/regionFunctionKingdom";
import { RegionFunctionCultures } from "./function/regionFunctionCultures";
import { RegionFunctionRaces } from "./function/regionFunctionRaces";
import { RegionFunctionSubRaces } from "./function/regionFunctionSubRaces";

interface IRegionAccordion {
    region: RegionDTO,
    pageNumber: number,
    pageSize: number,
    status: string
}

export function RegionAccordion(props: Readonly<IRegionAccordion>) {
    const [name, setName] = useState<string | undefined>();

    const { status, data } = useQuery({
        queryKey: ["region", name],
        queryFn: async () => RegionControllerService.getRegionByName(name!),
        enabled: !!name,
    })

    const getFullRegionDTO = async (name: string) => {
        setName(name);
    }

    const { editRegion, deleteRegion } =
        RegionFunction({ pageNumber: props.pageNumber, pageSize: props.pageSize, resetFullRegionDTO: getFullRegionDTO })
    const { saveImageToRegion, deleteImageFromRegion, addNewDesctiptionToRegion, updateRegionDescription, deleteDescriptionFromRegion } =
        RegionFunctionArray({ name: props.region!.region!.name! });
    const { getAllPlacesWithoutRegion, removePlaceFromRegionFunction, saveNewPlaceToRegion, saveExistingPlaceToRegion } =
        RegionFunctionPlaces({ name: props.region!.region!.name! });
    const { getAllKingdoms, removeKingdomFromRegionFunction, setNewKingdomToRegion, setExistingKingdomToRegion } =
        RegionFunctionKingdom({ name: props.region!.region!.name! });
    const { getAllCultures, removeCultureFromRegionFunction, saveNewCultureToRegion, saveExistingCultureToRegion } =
        RegionFunctionCultures({ name: props.region!.region!.name! });
    const { getAllRaces, removeRaceFromRegionFunction, saveNewRaceToRegion, saveExistingRaceToRegion } =
        RegionFunctionRaces({ name: props.region!.region!.name! });
    const { getAllSubRaces, removeSubRaceFromRegionFunction, saveNewSubRaceToRegion, saveExistingSubRaceToRegion } =
        RegionFunctionSubRaces({ name: props.region!.region!.name! });

    if (props.status === "pending") return <div>Loading...</div>;
    return (
        <AccordionHeaderLayout categoryName={"region"} updateEntry={editRegion}
            deleteEntry={deleteRegion} deleteMainObjectButtonActionText={"Delete"}
            entryFullDTO={{
                object: props.region.region,
                images: [],
                domObjects: {},
                subObjects: [],
                descriptions: []
            }} fetchFullValue={getFullRegionDTO} key={props.region.region?.id}>
            {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
            {data &&
                <Accordion.Body>
                    <DomCategoryBody categoryName={"Region"} mainEntryId={data.region?.id!}
                        descriptionOfConnectionString={"Kingdom of"} descriptionOfNullConnectionString={"This region isn't linked to any kingdom."}
                        domObject={data.kingdom}
                        domCategoryName={"Kingdom"} domCategoryLink={"kingdoms"}
                        fillTheListWithAllSubObjects={getAllKingdoms}
                        setNewDomEntryToRelation={setNewKingdomToRegion}
                        addExistingObjectToRelation={setExistingKingdomToRegion}
                        deleteSubObject={removeKingdomFromRegionFunction}
                        addButtonActionText={`Set new kingdom to ${data.region?.name}`}
                        deleteButtonActionText={`Unlink this region from kingdom`}
                        addExistingButtonActionText={`Set existing kingdom to ${data.region?.name}`} />
                    <FullEntryAccordionBody categoryName={"Region"} entryFullDTO={{
                        object: data.region,
                        domObjects: data.kingdom,
                        subObjects: data.places,
                        images: data.images,
                        descriptions: data.descriptions
                    }}
                        saveImageToEntry={saveImageToRegion}
                        deleteImageFromEntry={deleteImageFromRegion}
                        deleteImageButtonActionText={"Delete image"}
                        addNewDescriptionToEntry={addNewDesctiptionToRegion}
                        updateDescription={updateRegionDescription}
                        deleteDescriptionFromEntry={deleteDescriptionFromRegion} />
                    <SubCategoryBody mainEntryId={data.region?.id!}
                        subObjects={data.places}
                        subCategoryTitle={"Places"} subCategoryLink={"places"}
                        fillTheListWithAllSubObjects={getAllPlacesWithoutRegion}
                        addExistingObjectToRelation={saveExistingPlaceToRegion}
                        deleteSubObject={removePlaceFromRegionFunction}
                        addNewSubEntryToRelation={saveNewPlaceToRegion}
                        addButtonActionText={`Add new place to ${data.region?.name}`}
                        addExistingButtonActionText={"Link existing place to this region"}
                        deleteButtonActionText={`Unlink this place from ${data.region?.name}`}
                        subCategoryLinkText={"place"} />
                    <SubCategoryBody mainEntryId={data.region?.id!}
                        subObjects={data.cultures}
                        subCategoryTitle={"Cultures"} subCategoryLink={"cultures"}
                        fillTheListWithAllSubObjects={getAllCultures}
                        addExistingObjectToRelation={saveExistingCultureToRegion}
                        deleteSubObject={removeCultureFromRegionFunction}
                        addNewSubEntryToRelation={saveNewCultureToRegion}
                        addButtonActionText={`Add new culture to ${data.region?.name}`}
                        addExistingButtonActionText={"Link existing culture to this region"}
                        deleteButtonActionText={`Unlink this culture from ${data.region?.name}`}
                        subCategoryLinkText={"culture"} />
                    <SubCategoryBody mainEntryId={data.region?.id!}
                        subObjects={data.races}
                        subCategoryTitle={"Races"} subCategoryLink={"races"}
                        fillTheListWithAllSubObjects={getAllRaces}
                        addExistingObjectToRelation={saveExistingRaceToRegion}
                        deleteSubObject={removeRaceFromRegionFunction}
                        addNewSubEntryToRelation={saveNewRaceToRegion}
                        addButtonActionText={`Add new race to ${data.region?.name}`}
                        addExistingButtonActionText={"Link existing race to this region"}
                        deleteButtonActionText={`Unlink this race from ${data.region?.name}`}
                        subCategoryLinkText={"race"} />
                    <SubCategoryBody mainEntryId={data.region?.id!}
                        subObjects={data.places}
                        subCategoryTitle={"Sub races"} subCategoryLink={"places"}
                        fillTheListWithAllSubObjects={getAllSubRaces}
                        addExistingObjectToRelation={saveExistingSubRaceToRegion}
                        deleteSubObject={removeSubRaceFromRegionFunction}
                        addNewSubEntryToRelation={saveNewSubRaceToRegion}
                        addButtonActionText={`Add new subrace to ${data.region?.name}`}
                        addExistingButtonActionText={"Link existing subrace to this region"}
                        deleteButtonActionText={`Unlink this subrace from ${data.region?.name}`}
                        subCategoryLinkText={"subrace"} />
                </Accordion.Body>
            }
        </AccordionHeaderLayout>
    )
}