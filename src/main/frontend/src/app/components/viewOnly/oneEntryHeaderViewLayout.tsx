import { Col, Container, Row } from "react-bootstrap";
import { EntryFullDTO } from "../../../services/openapi";

interface IOneEntryHeaderViewLayout {
    categoryName: string,
    entryFullDTO: EntryFullDTO,
    children: string | React.ReactNode
}

export function OneEntryHeaderViewLayout(props: Readonly<IOneEntryHeaderViewLayout>) {
    return <div className="d-grid gap-2">
        <h1>{props.categoryName} {props.entryFullDTO.object?.name}</h1>
        <Container key={props.entryFullDTO.object?.id}>
            <Row className="accordion-header accordion-button oneEntryButton">
                <Col>
                    <span>#Tags #to #implement</span>
                    <p>
                        {props.entryFullDTO.object?.shortDescription}
                    </p>
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