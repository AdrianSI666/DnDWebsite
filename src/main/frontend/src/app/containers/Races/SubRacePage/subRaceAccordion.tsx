import { Accordion } from "react-bootstrap";
import { EntryFullDTO, SubRaceControllerService, SubRaceDTO } from "../../../../services/openapi";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../globalFunctions/RegionHooks";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { SubRaceFunction } from "./subRaceFunction";
import { SubRaceFunctionSubObjects } from "./subRaceFunctionSubObjects";
import { SubRaceFunctionDomObjects } from "./subRaceFunctionDomObjects";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SubRaceFunctionArray } from "./subRaceFunctionArrays";

interface ISubRaceAccordionBody {
    subRace: SubRaceDTO,
    pageNumber: number,
    pageSize: number,
    status: string
}


export function SubRaceAccordion(props: Readonly<ISubRaceAccordionBody>) {
    const [name, setName] = useState<string | undefined>();

    const { status, data } = useQuery({
        queryKey: ["subRace", name],
        queryFn: async () => SubRaceControllerService.getSubRaceByName(name!),
        enabled: !!name,
    })

    const getFullSubRaceDTO = async (name: string) => {
        setName(name);
    }

    const { editSubRace, deleteSubRace } = SubRaceFunction({ pageNumber: props.pageNumber, pageSize: props.pageSize, resetFullSubRaceDTO: getFullSubRaceDTO })
    const { saveImageToSubRace, deleteImageFromSubRace, addNewDesctiptionToSubRace, updateSubRaceDescription, deleteDescriptionFromSubRace } = SubRaceFunctionArray({ name: props.subRace.subRace?.name! });
    const { saveNewRegionToSubRace, saveExistingRegionToSubRace, removeRegionFromSubRaceFunction } = SubRaceFunctionSubObjects({ name: props.subRace.subRace?.name! });
    const { setNewRaceToSubRace, setExistingRaceToSubRace, removeRaceFromSubRaceFunction, getAllRaces } = SubRaceFunctionDomObjects({ name: props.subRace.subRace?.name! });

    if (props.status === "pending") return <div>Loading...</div>;
    const entryFullDTO: EntryFullDTO = {
        object: props?.subRace.subRace,
        domObjects: {},
        subObjects: [],
        descriptions: [],
        images: []
    }
    return (<AccordionHeaderLayout categoryName={"subRace"} updateEntry={editSubRace}
        deleteEntry={deleteSubRace} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={entryFullDTO} fetchFullValue={getFullSubRaceDTO} key={props.subRace.subRace?.id}>
        {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
        {data && <Accordion.Body>
            <DomCategoryBody categoryName={"SubRace"} mainEntryId={props.subRace.subRace?.id!}
                descriptionOfConnectionString={"Sub race of"} descriptionOfNullConnectionString={"This sub race doesn't have main race."}
                domObject={props.subRace.race}
                domCategoryName={"Race"} domCategoryLink={"races"}
                fillTheListWithAllSubObjects={getAllRaces}
                setNewDomEntryToRelation={setNewRaceToSubRace}
                addExistingObjectToRelation={setExistingRaceToSubRace}
                deleteSubObject={removeRaceFromSubRaceFunction}
                addButtonActionText={`Set new core race of ${props.subRace.subRace?.name}`}
                deleteButtonActionText={`Unset core race of ${props.subRace.subRace?.name}`}
                addExistingButtonActionText={`Set core race for ${props.subRace.subRace?.name} from list`} />
            <FullEntryAccordionBody categoryName={"SubRace"}
                entryFullDTO={{
                    object: data?.subRace,
                    domObjects: data?.race,
                    subObjects: [],
                    descriptions: data?.descriptions,
                    images: data?.images
                }}
                saveImageToEntry={saveImageToSubRace}
                deleteImageFromEntry={deleteImageFromSubRace}
                deleteImageButtonActionText={"Delete image"}
                addNewDescriptionToEntry={addNewDesctiptionToSubRace}
                updateDescription={updateSubRaceDescription}
                deleteDescriptionFromEntry={deleteDescriptionFromSubRace} />
            <SubCategoryBody mainEntryId={props.subRace.subRace?.id!}
                subObjects={props.subRace.regions}
                subCategoryTitle={"Region"} subCategoryLink={"regions"}
                fillTheListWithAllSubObjects={getAllRegions}
                addExistingObjectToRelation={saveExistingRegionToSubRace}
                deleteSubObject={removeRegionFromSubRaceFunction}
                addNewSubEntryToRelation={saveNewRegionToSubRace}
                addButtonActionText={"Add new region in which this sub race is present"}
                deleteButtonActionText={"Remove region in which this sub race is present"}
                addExistingButtonActionText={"Add region from the list in which this sub race is present"}
                subCategoryLinkText={"region"} />
        </Accordion.Body>}
    </AccordionHeaderLayout>
    )
}