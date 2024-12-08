import { Accordion } from "react-bootstrap";
import { EntryFullDTO, SubSpeciesControllerService, SubSpeciesDTO } from "../../../../services/openapi";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../globalFunctions/RegionHooks";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SubSpeciesFunction } from "./subSpeciesFunction";
import { SubSpeciesFunctionArray } from "./subSpeciesFunctionArrays";
import { SubSpeciesFunctionDomObjects } from "./subSpeciesFunctionDomObjects";
import { SubSpeciesFunctionSubObjects } from "./subSpeciesFunctionSubObjects";

interface ISubSpeciesAccordionBody {
    subSpecies: SubSpeciesDTO,
    pageNumber: number,
    pageSize: number,
    status: string
}


export function SubSpeciesAccordion(props: Readonly<ISubSpeciesAccordionBody>) {
    const [name, setName] = useState<string | undefined>();

    const { status, data } = useQuery({
        queryKey: ["subSpecies", name],
        queryFn: async () => SubSpeciesControllerService.getSubSpeciesByName(name!),
        enabled: !!name,
    })

    const getFullSubSpeciesDTO = async (name: string) => {
        setName(name);
    }

    const { editSubSpecies, deleteSubSpecies } = SubSpeciesFunction({ pageNumber: props.pageNumber, pageSize: props.pageSize, resetFullSubSpeciesDTO: getFullSubSpeciesDTO })
    const { saveImageToSubSpecies, deleteImageFromSubSpecies, addNewDesctiptionToSubSpecies, updateSubSpeciesDescription, deleteDescriptionFromSubSpecies } = SubSpeciesFunctionArray({ name: props.subSpecies.subSpecies?.name! });
    const { saveNewRegionToSubSpecies, saveExistingRegionToSubSpecies, removeRegionFromSubSpeciesFunction } = SubSpeciesFunctionSubObjects({ name: props.subSpecies.subSpecies?.name! });
    const { setNewSpeciesToSubSpecies, setExistingSpeciesToSubSpecies, removeSpeciesFromSubSpeciesFunction, getAllSpecies } = SubSpeciesFunctionDomObjects({ name: props.subSpecies.subSpecies?.name! });

    if (props.status === "pending") return <div>Loading...</div>;
    const entryFullDTO: EntryFullDTO = {
        object: props?.subSpecies.subSpecies,
        domObjects: {},
        subObjects: [],
        descriptions: [],
        images: []
    }
    return (<AccordionHeaderLayout categoryName={"Subspecies"} updateEntry={editSubSpecies}
    deleteEntry={deleteSubSpecies} deleteMainObjectButtonActionText={"Delete"}
    entryFullDTO={entryFullDTO} fetchFullValue={getFullSubSpeciesDTO} key={props.subSpecies.subSpecies?.id} mainEntryLink={"creatures/subspecies"}>
        {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
        {data && <Accordion.Body>
            <DomCategoryBody categoryName={"Subspecies"} mainEntryId={props.subSpecies.subSpecies?.id!}
                descriptionOfConnectionString={"Subspecies of"} descriptionOfNullConnectionString={"This subspecies doesn't have main species."}
                domObject={props.subSpecies.species}
                domCategoryName={"Species"} domCategoryLink={"species"}
                fillTheListWithAllSubObjects={getAllSpecies}
                setNewDomEntryToRelation={setNewSpeciesToSubSpecies}
                addExistingObjectToRelation={setExistingSpeciesToSubSpecies}
                deleteSubObject={removeSpeciesFromSubSpeciesFunction}
                addButtonActionText={`Set new core species of ${data.subSpecies?.name}`}
                deleteButtonActionText={`Unset core species of ${data.subSpecies?.name}`}
                addExistingButtonActionText={`Set core species for ${data.subSpecies?.name} from list`} />
            <FullEntryAccordionBody categoryName={"SubSpecies"}
                entryFullDTO={{
                    object: data?.subSpecies,
                    domObjects: data?.species,
                    subObjects: [],
                    descriptions: data?.descriptions,
                    images: data?.images
                }}
                saveImageToEntry={saveImageToSubSpecies}
                deleteImageFromEntry={deleteImageFromSubSpecies}
                deleteImageButtonActionText={"Delete image"}
                addNewDescriptionToEntry={addNewDesctiptionToSubSpecies}
                updateDescription={updateSubSpeciesDescription}
                deleteDescriptionFromEntry={deleteDescriptionFromSubSpecies} />
            <SubCategoryBody mainEntryId={props.subSpecies.subSpecies?.id!}
                subObjects={props.subSpecies.regions}
                subCategoryTitle={"Region"} subCategoryLink={"regions"}
                fillTheListWithAllSubObjects={getAllRegions}
                addExistingObjectToRelation={saveExistingRegionToSubSpecies}
                deleteSubObject={removeRegionFromSubSpeciesFunction}
                addNewSubEntryToRelation={saveNewRegionToSubSpecies}
                addButtonActionText={"Add new region in which this subspecies is present"}
                deleteButtonActionText={"Remove region in which this subspecies is present"}
                addExistingButtonActionText={"Add region from the list in which this subspecies is present"}
                subCategoryLinkText={"region"} />
        </Accordion.Body>}
    </AccordionHeaderLayout>
    )
}