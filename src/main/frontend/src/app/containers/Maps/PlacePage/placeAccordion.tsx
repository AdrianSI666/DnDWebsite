import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { EntryFullDTO, PlaceControllerService } from "../../../../services/openapi";
import { DomCategoryBody } from "../../../components/accordions/domCategoryBody";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import '../../../styles/masonary.css';
import "../../../styles/subObjects.css";
import { PlaceFunction } from "./function/placeFunction";
import { PlaceFunctionArray } from "./function/placeFunctionArrays";
import { PlaceFunctionDomObjects } from "./function/placeFunctionDomObjects";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";


interface IPlaceAccordion {
    place: EntryFullDTO,
    pageNumber: number,
    pageSize: number,
    status: string
}

export function PlaceAccordion(props: Readonly<IPlaceAccordion>) {
    const [name, setName] = useState<string | undefined>();

    const { status, data } = useQuery({
        queryKey: ["place", name],
        queryFn: async () => PlaceControllerService.getPlaceByName(name!),
        enabled: !!name,
    })

    const getFullPlaceDTO = async (name: string) => {
        setName(name);
    }

    const { editPlace, deletePlace } = PlaceFunction({ pageNumber: props.pageNumber, pageSize: props.pageSize, resetFullPlaceDTO: getFullPlaceDTO })
    const { saveImageToPlace, deleteImageFromPlace, addNewDesctiptionToPlace, updatePlaceDescription, deleteDescriptionFromPlace } = PlaceFunctionArray({ name: props.place!.object!.name! });
    const { setNewRegionToPlace, setExistingRegionToPlace, removeRegionFromPlaceFunction, getAllRegions } = PlaceFunctionDomObjects({ name: props.place!.object!.name! });

    if (props.status === "pending") return <div>Loading...</div>;
    return (<AccordionHeaderLayout categoryName={"place"} updateEntry={editPlace}
        deleteEntry={deletePlace} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={props.place} fetchFullValue={getFullPlaceDTO} key={props.place.object?.id}>
        {status === "pending" && <Accordion.Body>Loading...</Accordion.Body>}
        {data &&
            <Accordion.Body>
                <DomCategoryBody categoryName={"Place"} mainEntryId={data.object?.id!}
                    descriptionOfConnectionString={"Region of"} descriptionOfNullConnectionString={"This place isn't linked to any region."}
                    domObject={data.domObjects}
                    domCategoryName={"Region"} domCategoryLink={"regions"}
                    fillTheListWithAllSubObjects={getAllRegions}
                    setNewDomEntryToRelation={setNewRegionToPlace}
                    addExistingObjectToRelation={setExistingRegionToPlace}
                    deleteSubObject={removeRegionFromPlaceFunction}
                    addButtonActionText={`Set new region to ${data.object?.name}`}
                    deleteButtonActionText={`Unlink this place from region`}
                    addExistingButtonActionText={`Set existing region to ${data.object?.name}`} />
                <FullEntryAccordionBody categoryName={"Place"} entryFullDTO={data}
                    saveImageToEntry={saveImageToPlace}
                    deleteImageFromEntry={deleteImageFromPlace}
                    deleteImageButtonActionText={"Delete image"}
                    addNewDescriptionToEntry={addNewDesctiptionToPlace}
                    updateDescription={updatePlaceDescription}
                    deleteDescriptionFromEntry={deleteDescriptionFromPlace} />
            </Accordion.Body>
        }
    </AccordionHeaderLayout>
    )
}