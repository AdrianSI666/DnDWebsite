import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { WorldControllerService } from "../../../../services/openapi";
import useUserState from "../../../../services/storage/UserStorage";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { DeleteConfirmationModal } from "../../../components/modals/deleteConfirmModal";
import { EditEntryModal } from "../../../components/modals/editEntryModal";
import { UseOneWorldFunction } from "./useOneWorldFunction";
import { WorldFunctionArray } from "../../WorldPage/worldFunctionArrays";

export function OneWorldHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    let { name } = useParams();
    const { status, data: worldDTO, error } = useQuery({
        queryKey: ["world", name],
        queryFn: async () => WorldControllerService.getWorldByName(name!)
    })

    const { removeWorld, editWorld } = UseOneWorldFunction({ name: name! });
    const { saveImageToWorld, deleteImageFromWorld,
        addNewDesctiptionToWorld, updateWorldDescription, deleteDescriptionFromWorld } = WorldFunctionArray({ name: name! })

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>World named {name} doesn't exist.</h1>
    </div>;
    if (worldDTO.authorId === userId) {
        isAuthor = true
    }

    return <div>
        <Row className="accordion-header accordion-button oneEntryButton">
            <Col>
                <span>#Tags #to #implement</span>
                <p>
                    {worldDTO.world?.shortDescription}
                </p>
                {isAuthor ? <>
                    <EditEntryModal updateFunction={editWorld} categoryName={"World"} id={worldDTO.world?.id!} name={worldDTO.world?.name!} shortDescription={worldDTO.world?.shortDescription!} />
                    <DeleteConfirmationModal deleteButtonActionText={"Delete this world"} deleteObject={removeWorld} title={worldDTO.world?.name!} id={worldDTO.world?.id!} />
                </> : null}
            </Col>
        </Row>
        <Row className="accordion-body oneEntryBody">
            <Col>
                <FullEntryAccordionBody categoryName={"World"} entryFullDTO={{
                    object: worldDTO.world,
                    images: worldDTO.images,
                    descriptions: worldDTO.descriptions
                }}
                    saveImageToEntry={saveImageToWorld}
                    deleteImageFromEntry={deleteImageFromWorld}
                    deleteImageButtonActionText={"Delete image"}
                    addNewDescriptionToEntry={addNewDesctiptionToWorld}
                    updateDescription={updateWorldDescription}
                    deleteDescriptionFromEntry={deleteDescriptionFromWorld} isAuthor={isAuthor} />
            </Col>
        </Row>
    </div >
}