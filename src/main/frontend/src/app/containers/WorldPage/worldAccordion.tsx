import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import '../../styles/masonary.css';
import "../../styles/subObjects.css";
import { WorldFunction } from "../UserHomePage/worldFunction";
import { WorldFunctionArray } from "./worldFunctionArrays";
import { EntryFullDTO, WorldControllerService } from "../../../services/openapi";
import { BrowsingListLayout } from "../../components/accordions/browsingListLayout";
import { FullEntryAccordionBody } from "../../components/accordions/fullEntryAccordionBody";

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
  const { saveImageToWorld, deleteImageFromWorld, addNewDesctiptionToWorld, updateWorldDescription, deleteDescriptionFromWorld } = WorldFunctionArray({ name: props.world!.object!.name! });

  const getFullWorldDTO = async (name: string) => {
    setName(name);
  }

  if (props.status === "pending") return <div>Loading...</div>;
  return (<BrowsingListLayout categoryName={"world"} updateEntry={editWorld}
  deleteEntry={deleteWorld} deleteMainObjectButtonActionText={"Delete"}
  entryFullDTO={props.world} fetchFullValue={getFullWorldDTO} key={props.world.object?.id} mainEntryLink={"worlds"}>
    {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
    {data && <Accordion.Body>
      <FullEntryAccordionBody categoryName={"World"} entryFullDTO={{
        object: data.world,
        images: data.images,
        descriptions: data.descriptions
      }}
        saveImageToEntry={saveImageToWorld}
        deleteImageFromEntry={deleteImageFromWorld}
        deleteImageButtonActionText={"Delete image"}
        addNewDescriptionToEntry={addNewDesctiptionToWorld}
        updateDescription={updateWorldDescription}
        deleteDescriptionFromEntry={deleteDescriptionFromWorld} />
    </Accordion.Body>
    }
  </BrowsingListLayout>
  )
}