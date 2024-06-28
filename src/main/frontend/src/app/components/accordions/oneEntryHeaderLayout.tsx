import { Col, Container, Row } from "react-bootstrap";
import { EntryFullDTO } from "../../../services/openapi";
import { DeleteConfirmationModal } from "../modals/deleteConfirmModal";
import { EditEntryModal } from "../modals/editEntryModal";

interface IOneEntryHeaderLayout {
    deleteMainObjectButtonActionText: string;
    deleteEntry: (id: number) => Promise<void>;
    updateEntry: (id: number, name: string, shortDescription: string) => Promise<void>;
    categoryName: string;
    entryFullDTO: EntryFullDTO,
    children: string | React.ReactNode
}

export function OneEntryHeaderLayout(props: Readonly<IOneEntryHeaderLayout>) {
    return <div className="d-grid gap-2">
        <h1>{props.categoryName} {props.entryFullDTO.object?.name}</h1>
        <Container key={props.entryFullDTO.object?.id}>
            <Row className="accordion-header accordion-button oneEntryButton">
                <Col>
                    <span>#Tags #to #implement</span>
                    <p>
                        {props.entryFullDTO.object?.shortDescription}
                    </p>
                    <EditEntryModal updateFunction={props.updateEntry} categoryName={props.categoryName} id={props.entryFullDTO.object?.id!} name={props.entryFullDTO.object?.name!} shortDescription={props.entryFullDTO.object?.shortDescription!} />
                    <DeleteConfirmationModal deleteButtonActionText={props.deleteMainObjectButtonActionText} deleteObject={props.deleteEntry} title={props.entryFullDTO.object?.name!} id={props.entryFullDTO.object?.id!} />
                </Col>
            </Row>
            <Row className="accordion-body oneEntryBody">
                <Col>
                    {props.children}
                </Col>
            </Row>
        </Container>
    </div>
}