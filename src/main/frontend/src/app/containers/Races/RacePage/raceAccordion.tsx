import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";

import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { RaceFunction } from "./raceFunction";
import { EntryFullDTO, RaceControllerService, RaceDTO } from "../../../../services/openapi";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../globalFunctions/RegionHooks";
import { RaceFunctionArray } from "./raceFunctionArrays";
import { RaceFunctionSubObjects } from "./raceFunctionSubObjects";

interface IRaceAccordion {
  race: RaceDTO,
  pageNumber: number,
  pageSize: number,
  status: string
}

export function RaceAccordion(props: Readonly<IRaceAccordion>) {
  const [name, setName] = useState<string | undefined>();

  const { status, data } = useQuery({
    queryKey: ["race", name],
    queryFn: async () => RaceControllerService.getRaceByName(name!),
    enabled: !!name,
  })

  const getFullRaceDTO = async (name: string) => {
    setName(name);
  }

  const { editRace, deleteRace } = RaceFunction({ pageNumber: props.pageNumber, pageSize: props.pageSize, resetFullRaceDTO: getFullRaceDTO })
  const { saveImageToRace, deleteImageFromRace, addNewDesctiptionToRace, updateRaceDescription, deleteDescriptionFromRace } = RaceFunctionArray({ name: props.race!.race!.name! });
  const { getAllSubRaces,
    removeSubRaceFromRaceFunction, saveNewSubRaceToRace, saveExistingSubRaceToRace,
    saveNewRegionToRace, saveExistingRegionToRace, removeRegionFromRaceFunction } = RaceFunctionSubObjects({ name: props.race!.race!.name! });

  if (props.status === "pending") return <div>Loading...</div>;
  const entryFullDTO: EntryFullDTO = {
    object: props?.race.race,
    domObjects: {},
    subObjects: [],
    descriptions: [],
    images: []
  }
  return (<AccordionHeaderLayout categoryName={"race"} updateEntry={editRace}
    deleteEntry={deleteRace} deleteMainObjectButtonActionText={"Delete"}
    entryFullDTO={entryFullDTO} fetchFullValue={getFullRaceDTO} key={props.race.race?.id}>
    {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
    {data && <Accordion.Body>
      <FullEntryAccordionBody categoryName={"race"}
        entryFullDTO={{
          object: data?.race,
          domObjects: {},
          subObjects: data?.subRaces,
          descriptions: data?.descriptions,
          images: data?.images
        }}
        saveImageToEntry={saveImageToRace}
        deleteImageFromEntry={deleteImageFromRace}
        deleteImageButtonActionText={"Delete image"}
        addNewDescriptionToEntry={addNewDesctiptionToRace}
        updateDescription={updateRaceDescription}
        deleteDescriptionFromEntry={deleteDescriptionFromRace} />
      <SubCategoryBody mainEntryId={data.race?.id!}
        subObjects={data.subRaces}
        subCategoryTitle={"Sub races"} subCategoryLink={"subRaces"}
        fillTheListWithAllSubObjects={getAllSubRaces}
        addExistingObjectToRelation={saveExistingSubRaceToRace}
        deleteSubObject={removeSubRaceFromRaceFunction}
        addNewSubEntryToRelation={saveNewSubRaceToRace}
        addButtonActionText={"Add new sub race that originated from this race"}
        addExistingButtonActionText={"Link existing sub race to this main race"}
        deleteButtonActionText={`Unlink this sub race from ${data.race?.name}`}
        subCategoryLinkText={"sub race"} />
      <SubCategoryBody mainEntryId={data!.race?.id!}
        subObjects={data!.regions}
        subCategoryTitle={"Regions"} subCategoryLink={"regions"}
        fillTheListWithAllSubObjects={getAllRegions}
        addExistingObjectToRelation={saveExistingRegionToRace}
        deleteSubObject={removeRegionFromRaceFunction}
        addNewSubEntryToRelation={saveNewRegionToRace}
        addButtonActionText={"Add new region that use this race"}
        addExistingButtonActionText={"Link existing region from list to this race"}
        deleteButtonActionText={`Unlink this region from ${data!.race?.name}`}
        subCategoryLinkText={"region"} />
    </Accordion.Body>}

  </AccordionHeaderLayout>
  )
}