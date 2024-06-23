import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { CultureControllerService, EntryFullDTO } from "../../../services/openapi";
import { AccordionHeaderLayout } from "../../components/accordions/accordionHeaderLayout";
import { FullEntryAccordionBody } from "../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../globalFunctions/RegionHooks";
import '../../styles/masonary.css';
import "../../styles/subObjects.css";
import { CultureFunction } from "./cultureFunction";
import { CultureFunctionArray } from "./cultureFunctionArrays";
import { CultureFunctionSubObjects } from "./cultureFunctionSubObjects";

interface ICultureAccordion {
  culture: EntryFullDTO,
  pageNumber: number,
  pageSize: number,
  status: string
}

export function CultureAccordion(props: Readonly<ICultureAccordion>) {
  const [name, setName] = useState<string | undefined>();

  const { status, data } = useQuery({
    queryKey: ["culture", name],
    queryFn: async () => CultureControllerService.getCultureByName(name!),
    enabled: !!name,
  })

  const getFullCultureDTO = async (name: string) => {
    setName(name);
  }

  const { editCulture, deleteCulture } = CultureFunction({ pageNumber: props.pageNumber, pageSize: props.pageSize, resetFullEntryDTO: getFullCultureDTO })
  const { saveImageToCulture, deleteImageFromCulture, addNewDesctiptionToCulture, updateCultureDescription, deleteDescriptionFromCulture } = CultureFunctionArray({ name: props.culture.object!.name! });
  const { saveNewRegionToCulture, saveExistingRegionToCulture, removeRegionFromCultureFunction } = CultureFunctionSubObjects({ name: props.culture.object!.name! });

  if (props.status === "pending") return <div>Loading...</div>;

  return (<AccordionHeaderLayout categoryName={"culture"} updateEntry={editCulture}
    deleteEntry={deleteCulture} deleteMainObjectButtonActionText={"Delete"}
    entryFullDTO={props.culture} fetchFullValue={getFullCultureDTO} key={props.culture.object?.id}>
    {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
    {data && <Accordion.Body>
      <FullEntryAccordionBody categoryName={"culture"} entryFullDTO={data!}
        saveImageToEntry={saveImageToCulture}
        deleteImageFromEntry={deleteImageFromCulture}
        deleteImageButtonActionText={"Delete image"}
        addNewDescriptionToEntry={addNewDesctiptionToCulture}
        updateDescription={updateCultureDescription}
        deleteDescriptionFromEntry={deleteDescriptionFromCulture} />
      <SubCategoryBody mainEntryId={data!.object?.id!}
        subObjects={data!.subObjects}
        subCategoryTitle={"Regions"} subCategoryLink={"regions"}
        fillTheListWithAllSubObjects={getAllRegions}
        addExistingObjectToRelation={saveExistingRegionToCulture}
        deleteSubObject={removeRegionFromCultureFunction}
        addNewSubEntryToRelation={saveNewRegionToCulture}
        addButtonActionText={"Add new region that use this culture"}
        addExistingButtonActionText={"Link existing region from list to this culture"}
        deleteButtonActionText={`Unlink this region from ${data!.object?.name}`}
        subCategoryLinkText={"region"} />
    </Accordion.Body>}

  </AccordionHeaderLayout>
  )
}