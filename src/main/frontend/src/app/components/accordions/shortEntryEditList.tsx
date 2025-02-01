import { Col, Container, Row } from "react-bootstrap";
import { HeaderLink } from "../../containers/Header/HeaderLink";
import { DeleteConfirmationModal } from "../modals/deleteConfirmModal";
import { EditEntryModal } from "../modals/editEntryModal";
import { EntryDTO } from "../../../services/openapi/models/EntryDTO";

interface IShortEntryEditList {
    wordName: string;
    linkToHomePage: string;
    isAuthor: boolean;
    deleteEntry: (id: number) => Promise<void>;
    updateEntry: (id: number, name: string, shortDescription: string) => Promise<void>;
    categoryName: string;
    entryDTO: EntryDTO,
}

export function ShortEntryEditList(props: IShortEntryEditList) {
    return <Container key={props.entryDTO.id}>
        <h1>{props.categoryName} {props.entryDTO.name}</h1>
        <Row className="accordion-header accordion-button oneEntryButton">
            <Col>
                <span>#Tags #to #implement</span>
                <p>
                    {props.entryDTO.shortDescription}
                </p>
                {props.isAuthor ? <>
                    <EditEntryModal updateFunction={props.updateEntry} categoryName={props.categoryName} id={props.entryDTO.id!} name={props.entryDTO.name!} shortDescription={props.entryDTO.shortDescription!} />
                    <DeleteConfirmationModal deleteButtonActionText={"Delete this " + props.categoryName} deleteObject={props.deleteEntry} title={props.entryDTO.name!} id={props.entryDTO.id!} />
                </> : null}
                <HeaderLink name={props.entryDTO.name!} link={"/worlds/home/" + props.wordName + props.linkToHomePage + props.entryDTO.name} />
            </Col>
        </Row>
    </Container>
}