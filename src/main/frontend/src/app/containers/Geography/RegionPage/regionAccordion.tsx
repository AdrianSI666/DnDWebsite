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
import { RegionFunctionContinent } from "./function/regionFunctionContinent";
import { RegionFunctionCultures } from "./function/regionFunctionCultures";
import { RegionFunctionSpecies } from "./function/regionFunctionSpecies";
import { RegionFunctionSubSpecies } from "./function/regionFunctionSubSpecies";
import { RegionFunctionCounties } from "./function/regionFunctionCounties";

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
    const { getAllContinents, removeContinentFromRegionFunction, setNewContinentToRegion, setExistingContinentToRegion } =
        RegionFunctionContinent({ name: props.region!.region!.name! });
    const { getAllCultures, removeCultureFromRegionFunction, saveNewCultureToRegion, saveExistingCultureToRegion } =
        RegionFunctionCultures({ name: props.region!.region!.name! });
    const { getAllSpecies, removeSpeciesFromRegionFunction, saveNewSpeciesToRegion, saveExistingSpeciesToRegion } =
        RegionFunctionSpecies({ name: props.region!.region!.name! });
    const { getAllSubSpecies, removeSubSpeciesFromRegionFunction, saveNewSubSpeciesToRegion, saveExistingSubSpeciesToRegion } =
        RegionFunctionSubSpecies({ name: props.region!.region!.name! });
    const { getAllCounties, removeCountyFromRegionFunction, saveNewCountyToRegion, saveExistingCountyToRegion } =
        RegionFunctionCounties({ name: props.region!.region!.name! });

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
            }} fetchFullValue={getFullRegionDTO} key={props.region.region?.id} mainEntryLink={"geography/regions"}>
            {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
            {data &&
                <Accordion.Body>
                    <DomCategoryBody categoryName={"Region"} mainEntryId={data.region?.id!}
                        descriptionOfConnectionString={"Continent of"} descriptionOfNullConnectionString={"This region isn't linked to any continent."}
                        domObject={data.continent}
                        domCategoryName={"Continent"} domCategoryLink={"geography/continents"}
                        fillTheListWithAllSubObjects={getAllContinents}
                        setNewDomEntryToRelation={setNewContinentToRegion}
                        addExistingObjectToRelation={setExistingContinentToRegion}
                        deleteSubObject={removeContinentFromRegionFunction}
                        addButtonActionText={`Set new continent to ${data.region?.name}`}
                        deleteButtonActionText={`Unlink this region from continent`}
                        addExistingButtonActionText={`Set existing continent to ${data.region?.name}`} />
                    <FullEntryAccordionBody categoryName={"Region"} entryFullDTO={{
                        object: data.region,
                        domObjects: data.continent,
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
                        subCategoryTitle={"Places"} subCategoryLink={"geography/places"}
                        fillTheListWithAllSubObjects={getAllPlacesWithoutRegion}
                        addExistingObjectToRelation={saveExistingPlaceToRegion}
                        deleteSubObject={removePlaceFromRegionFunction}
                        addNewSubEntryToRelation={saveNewPlaceToRegion}
                        addButtonActionText={`Add new place to ${data.region?.name}`}
                        addExistingButtonActionText={"Link existing place to this region"}
                        deleteButtonActionText={`Unlink this place from ${data.region?.name}`}
                        subCategoryLinkText={"geography/places"} />
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
                        subObjects={data.species}
                        subCategoryTitle={"Species"} subCategoryLink={"creatures/species"}
                        fillTheListWithAllSubObjects={getAllSpecies}
                        addExistingObjectToRelation={saveExistingSpeciesToRegion}
                        deleteSubObject={removeSpeciesFromRegionFunction}
                        addNewSubEntryToRelation={saveNewSpeciesToRegion}
                        addButtonActionText={`Add new species to ${data.region?.name}`}
                        addExistingButtonActionText={"Link existing species to this region"}
                        deleteButtonActionText={`Unlink this species from ${data.region?.name}`}
                        subCategoryLinkText={"creatures/species"} />
                    <SubCategoryBody mainEntryId={data.region?.id!}
                        subObjects={data.subSpecies}
                        subCategoryTitle={"Sub species"} subCategoryLink={"creatures/subspecies"}
                        fillTheListWithAllSubObjects={getAllSubSpecies}
                        addExistingObjectToRelation={saveExistingSubSpeciesToRegion}
                        deleteSubObject={removeSubSpeciesFromRegionFunction}
                        addNewSubEntryToRelation={saveNewSubSpeciesToRegion}
                        addButtonActionText={`Add new subspecies to ${data.region?.name}`}
                        addExistingButtonActionText={"Link existing subspecies to this region"}
                        deleteButtonActionText={`Unlink this subspecies from ${data.region?.name}`}
                        subCategoryLinkText={"creatures/subspecies"} />
                    <SubCategoryBody mainEntryId={data.region?.id!}
                        subObjects={data.counties}
                        subCategoryTitle={"Counties"} subCategoryLink={"politics/counties"}
                        fillTheListWithAllSubObjects={getAllCounties}
                        addExistingObjectToRelation={saveExistingCountyToRegion}
                        deleteSubObject={removeCountyFromRegionFunction}
                        addNewSubEntryToRelation={saveNewCountyToRegion}
                        addButtonActionText={`Add new county to ${data.region?.name}`}
                        addExistingButtonActionText={"Link existing county to this region"}
                        deleteButtonActionText={`Unlink this county from ${data.region?.name}`}
                        subCategoryLinkText={"politics/counties"} />
                </Accordion.Body>
            }
        </AccordionHeaderLayout>
    )
}