import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { CreatureTypeControllerService, EntryFullDTO } from "../../../../services/openapi";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { TypeFunction } from "./typeFunction";
import { TypeFunctionArray } from "./typeFunctionArrays";
import { TypeFunctionSubObjects } from "./typeFunctionSubObjects";

interface ITypeAccordion {
  type: EntryFullDTO,
  pageNumber: number,
  pageSize: number,
  status: string
}

export function TypeAccordion(props: Readonly<ITypeAccordion>) {
  const [name, setName] = useState<string | undefined>();

  const { status, data } = useQuery({
    queryKey: ["creatureType", name],
    queryFn: async () => CreatureTypeControllerService.getFullCreatureTypeByName(name!),
    enabled: !!name,
  })

  const getFullTypeDTO = async (name: string) => {
    setName(name);
  }

  const { editType, deleteType } = TypeFunction({ pageNumber: props.pageNumber, pageSize: props.pageSize, resetFullEntryDTO: getFullTypeDTO })
  const { saveImageToType, deleteImageFromType, addNewDesctiptionToType, updateTypeDescription, deleteDescriptionFromType } = TypeFunctionArray({ name: props.type.object!.name! });
  const { saveNewSpeciesToType, saveExistingSpeciesToType, removeSpeciesFromTypeFunction, getAllSpecies, saveExistingPlaneToCreatureType, saveNewPlaneToCreatureType, removePlaneFromCreatureTypeFunction, getAllPlanes } = TypeFunctionSubObjects({ name: props.type.object!.name! });

  if (props.status === "pending") return <div>Loading...</div>;

  return (<AccordionHeaderLayout categoryName={"type"} updateEntry={editType}
  deleteEntry={deleteType} deleteMainObjectButtonActionText={"Delete"}
  entryFullDTO={props.type} fetchFullValue={getFullTypeDTO} key={props.type.object?.id}
  mainEntryLink={"creatures/types"}>
    {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
    {data && <Accordion.Body>
      <FullEntryAccordionBody categoryName={"type"} entryFullDTO={{
        object: data.creatureType,
        images: data.images,
        descriptions: data.descriptions
      }}
        saveImageToEntry={saveImageToType}
        deleteImageFromEntry={deleteImageFromType}
        deleteImageButtonActionText={"Delete image"}
        addNewDescriptionToEntry={addNewDesctiptionToType}
        updateDescription={updateTypeDescription}
        deleteDescriptionFromEntry={deleteDescriptionFromType} />
      <SubCategoryBody mainEntryId={data!.creatureType?.id!}
        subObjects={data!.species}
        subCategoryTitle={"Speciess"} subCategoryLink={"creatures/species"}
        fillTheListWithAllSubObjects={getAllSpecies}
        addExistingObjectToRelation={saveExistingSpeciesToType}
        deleteSubObject={removeSpeciesFromTypeFunction}
        addNewSubEntryToRelation={saveNewSpeciesToType}
        addButtonActionText={"Add new species that use this type"}
        addExistingButtonActionText={"Link existing species from list to this type"}
        deleteButtonActionText={`Unlink this species from ${data!.creatureType?.name}`}
        subCategoryLinkText={"species"} />
      <SubCategoryBody mainEntryId={data!.creatureType?.id!}
        subObjects={data!.planes}
        subCategoryTitle={"Planes"} subCategoryLink={"planes"}
        fillTheListWithAllSubObjects={getAllPlanes}
        addExistingObjectToRelation={saveExistingPlaneToCreatureType}
        deleteSubObject={removePlaneFromCreatureTypeFunction}
        addNewSubEntryToRelation={saveNewPlaneToCreatureType}
        addButtonActionText={"Add new plane that use this species"}
        addExistingButtonActionText={"Link existing plane from list to this species"}
        deleteButtonActionText={`Unlink this plane from ${data!.creatureType?.name}`}
        subCategoryLinkText={"plane"} />
    </Accordion.Body>}

  </AccordionHeaderLayout>
  )
}