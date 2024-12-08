import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";

import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { EntryFullDTO, SpeciesControllerService, SpeciesDTO } from "../../../../services/openapi";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../globalFunctions/RegionHooks";
import { SpeciesFunction } from "./speciesFunction";
import { SpeciesFunctionArray } from "./speciesFunctionArrays";
import { SpeciesFunctionSubObjects } from "./speciesFunctionSubObjects";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { SpeciesFunctionDomObjects } from "./speciesFunctionDomObjects";

interface ISpeciesAccordion {
  species: SpeciesDTO,
  pageNumber: number,
  pageSize: number,
  status: string
}

export function SpeciesAccordion(props: Readonly<ISpeciesAccordion>) {
  const [name, setName] = useState<string | undefined>();

  const { status, data } = useQuery({
    queryKey: ["species", name],
    queryFn: async () => SpeciesControllerService.getSpeciesByName(name!),
    enabled: !!name,
  })

  const getFullSpeciesDTO = async (name: string) => {
    setName(name);
  }

  const { editSpecies, deleteSpecies } = SpeciesFunction({ pageNumber: props.pageNumber, pageSize: props.pageSize, resetFullSpeciesDTO: getFullSpeciesDTO })
  const { saveImageToSpecies, deleteImageFromSpecies, addNewDesctiptionToSpecies, updateSpeciesDescription, deleteDescriptionFromSpecies } = SpeciesFunctionArray({ name: props.species!.species!.name! });
  const { getAllSubSpecies,
    removeSubSpeciesFromSpeciesFunction, saveNewSubSpeciesToSpecies, saveExistingSubSpeciesToSpecies,
    saveNewRegionToSpecies, saveExistingRegionToSpecies, removeRegionFromSpeciesFunction } = SpeciesFunctionSubObjects({ name: props.species!.species!.name! });
  const {setNewCreatureTypeToSpecies, setExistingCreatureTypeToSpecies, removeCreatureTypeFromSpeciesFunction, getAllCreatureType} = SpeciesFunctionDomObjects({ name: props.species!.species!.name! });

  if (props.status === "pending") return <div>Loading...</div>;
  const entryFullDTO: EntryFullDTO = {
    object: props?.species.species,
    domObjects: {},
    subObjects: [],
    descriptions: [],
    images: []
  }
  return (<AccordionHeaderLayout categoryName={"species"} updateEntry={editSpecies}
  deleteEntry={deleteSpecies} deleteMainObjectButtonActionText={"Delete"}
  entryFullDTO={entryFullDTO} fetchFullValue={getFullSpeciesDTO} key={props.species.species?.id} mainEntryLink={"creatures/species"}>
    {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
    {data && <Accordion.Body>
      <DomCategoryBody categoryName={"Type"} mainEntryId={props.species.creatureType?.id!}
                descriptionOfConnectionString={"Type of"} descriptionOfNullConnectionString={"No type for this species."}
                domObject={props.species.creatureType}
                domCategoryName={"Type"} domCategoryLink={"types"}
                fillTheListWithAllSubObjects={getAllCreatureType}
                setNewDomEntryToRelation={setNewCreatureTypeToSpecies}
                addExistingObjectToRelation={setExistingCreatureTypeToSpecies}
                deleteSubObject={removeCreatureTypeFromSpeciesFunction}
                addButtonActionText={`Set new type of ${data.species?.name}`}
                deleteButtonActionText={`Unset type of ${data.species?.name}`}
                addExistingButtonActionText={`Set type for ${data.species?.name} from list`}
      />
      <FullEntryAccordionBody categoryName={"species"}
        entryFullDTO={{
          object: data?.species,
          domObjects: {},
          subObjects: data?.subSpecies,
          descriptions: data?.descriptions,
          images: data?.images
        }}
        saveImageToEntry={saveImageToSpecies}
        deleteImageFromEntry={deleteImageFromSpecies}
        deleteImageButtonActionText={"Delete image"}
        addNewDescriptionToEntry={addNewDesctiptionToSpecies}
        updateDescription={updateSpeciesDescription}
        deleteDescriptionFromEntry={deleteDescriptionFromSpecies} />
      <SubCategoryBody mainEntryId={data.species?.id!}
        subObjects={data.subSpecies}
        subCategoryTitle={"Sub species"} subCategoryLink={"creatures/subspecies"}
        fillTheListWithAllSubObjects={getAllSubSpecies}
        addExistingObjectToRelation={saveExistingSubSpeciesToSpecies}
        deleteSubObject={removeSubSpeciesFromSpeciesFunction}
        addNewSubEntryToRelation={saveNewSubSpeciesToSpecies}
        addButtonActionText={"Add new sub species that originated from this species"}
        addExistingButtonActionText={"Link existing sub species to this main species"}
        deleteButtonActionText={`Unlink this sub species from ${data.species?.name}`}
        subCategoryLinkText={"sub species"} />
      <SubCategoryBody mainEntryId={data!.species?.id!}
        subObjects={data!.regions}
        subCategoryTitle={"Regions"} subCategoryLink={"regions"}
        fillTheListWithAllSubObjects={getAllRegions}
        addExistingObjectToRelation={saveExistingRegionToSpecies}
        deleteSubObject={removeRegionFromSpeciesFunction}
        addNewSubEntryToRelation={saveNewRegionToSpecies}
        addButtonActionText={"Add new region that use this species"}
        addExistingButtonActionText={"Link existing region from list to this species"}
        deleteButtonActionText={`Unlink this region from ${data!.species?.name}`}
        subCategoryLinkText={"region"} />
    </Accordion.Body>}

  </AccordionHeaderLayout>
  )
}