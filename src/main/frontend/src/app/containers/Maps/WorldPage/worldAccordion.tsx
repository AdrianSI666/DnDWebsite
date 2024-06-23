import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { EntryFullDTO, WorldControllerService } from "../../../../services/openapi";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { WorldFunction } from "./worldFunction";
import { WorldFunctionArray } from "./worldFunctionArrays";
import { WorldFunctionSubObjects } from "./worldFunctionSubObjects";

interface IWorldAccordion {
  world: EntryFullDTO,
  pageNumber: number,
  pageSize: number,
  status: string
}

export function WorldAccordion(props: Readonly<IWorldAccordion>) {
  const [name, setName] = useState<string | undefined>();

  const { status, data } = useQuery({
    queryKey: ["world", name],
    queryFn: async () => WorldControllerService.getWorldByName(name!),
    enabled: !!name,
  })

  const getFullWorldDTO = async (name: string) => {
    setName(name);
  }

  const { editWorld, deleteWorld } = WorldFunction({ pageNumber: props.pageNumber, pageSize: props.pageSize, resetFullWorldDTO: getFullWorldDTO })
  const { saveImageToWorld, deleteImageFromWorld, addNewDesctiptionToWorld, updateWorldDescription, deleteDescriptionFromWorld } = WorldFunctionArray({ name: props.world!.object!.name! });
  const { getAllPlanesWithoutWorld,
    saveExistingPlaneToWorld, removePlaneFromWorldFunction, saveNewPlaneToWorld } = WorldFunctionSubObjects({ name: props.world!.object!.name! });

  if (props.status === "pending") return <div>Loading...</div>;
  return (<AccordionHeaderLayout categoryName={"world"} updateEntry={editWorld}
    deleteEntry={deleteWorld} deleteMainObjectButtonActionText={"Delete"}
    entryFullDTO={props.world} fetchFullValue={getFullWorldDTO} key={props.world.object?.id}>
    {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
    {data && <Accordion.Body>
      <FullEntryAccordionBody categoryName={"World"} entryFullDTO={data}
        saveImageToEntry={saveImageToWorld}
        deleteImageFromEntry={deleteImageFromWorld}
        deleteImageButtonActionText={"Delete image"}
        addNewDescriptionToEntry={addNewDesctiptionToWorld}
        updateDescription={updateWorldDescription}
        deleteDescriptionFromEntry={deleteDescriptionFromWorld} />
      <SubCategoryBody mainEntryId={data.object?.id!}
        subObjects={data.subObjects}
        subCategoryTitle={"Planes"} subCategoryLink={"planes"}
        fillTheListWithAllSubObjects={getAllPlanesWithoutWorld}
        addExistingObjectToRelation={saveExistingPlaneToWorld}
        deleteSubObject={removePlaneFromWorldFunction}
        addNewSubEntryToRelation={saveNewPlaneToWorld}
        addButtonActionText={`Add new plane that exist on ${data.object?.name}`}
        addExistingButtonActionText={"Link existing plane to this World"}
        deleteButtonActionText={`Unlink this plane from ${data.object?.name}`}
        subCategoryLinkText={"plane"} />
    </Accordion.Body>
    }
  </AccordionHeaderLayout>
  )
}