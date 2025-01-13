import { Col, Container, Row } from "react-bootstrap";
import { EntryDTOnWorldData } from "../../../services/openapi/models/EntryDTOnWorldData";
import { HeaderLink } from "../../containers/Header/HeaderLink";

interface IAccordionHeaderLayout {
    entryDTOnWorldData: EntryDTOnWorldData,
    mainEntryLink: string
}

export function BrowsingListLayout(props: Readonly<IAccordionHeaderLayout>) {
    return (<Container key={props.entryDTOnWorldData?.id}>
        <h1>{props.entryDTOnWorldData?.name}</h1>
        <Row className="accordion-header accordion-button oneEntryButton">
            <Col>
                <span>#Tags #to #implement</span>
                <p>
                    {props.entryDTOnWorldData?.shortDescription}
                </p>
                <span>Author: {props.entryDTOnWorldData.authorName}</span>
                <span>World: {props.entryDTOnWorldData.worldName}</span>
                <HeaderLink name={props.entryDTOnWorldData?.name!} link={"/worlds/home/" + props.entryDTOnWorldData?.worldName + "/" + props.mainEntryLink + "/" + props.entryDTOnWorldData?.name} />
            </Col>
        </Row>
    </Container>)
}