import { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Masonry from "react-masonry-css";
import { EntryFullDTO } from "../../../services/openapi";
import { GriddingNotes, IGridNotes } from "../../utils/griddingNotes";

interface IViewFullEntryAccordionBody {
    categoryName: string;
    entryFullDTO: EntryFullDTO,
}

const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
};

export function ViewFullEntryAccordionBody(props: Readonly<IViewFullEntryAccordionBody>) {
    const { grindNotes } = GriddingNotes();
    let init: IGridNotes = {
        rows: []
    };
    const [grid, setGrid] = useState(init)

    useEffect(() => {
        if (props.entryFullDTO.descriptions!.length > 0) {
            grindNotes(props.entryFullDTO.descriptions!).then(res => {
                setGrid(res)
            })
        } else {
            setGrid(init)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.entryFullDTO.descriptions?.length, props.entryFullDTO.descriptions])
    return (
        <div>
            <h3>Description board</h3>
            <Container fluid className="noteBoard min-vw-10 min-vh-10">
                {grid.rows.map(row => {
                    return (
                        <Row className="my-masonry-grid mt-1" key={row.number}>
                            {row.descriptions.map(desc => {
                                let style = "text-center w-auto my-masonry-grid_column w-" + desc.size;
                                return (
                                    <Col md={{ span: Math.round(desc.size! / 25) * 3 }} key={desc.id}>
                                        <Card className={style} border="warning" key={desc.id}>
                                            <Card.Header>{desc.title}</Card.Header>
                                            <Card.Body>
                                                <Form.Control as="textarea" rows={Math.round(desc.size! / 5)} cols={desc.size} readOnly value={desc.text} />
                                            </Card.Body>
                                            <Card.Footer>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                )
                            })}
                        </Row>
                    )
                })
                }

            </Container>
            <h3>Images</h3>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column">

                {props.entryFullDTO.images!.map(oneImage => {
                    const imageSrc = "data:image/jpg;base64," + oneImage.content
                    const imageName = oneImage.name
                    return (
                        <div key={oneImage.id}>
                            <h3>{imageName}</h3>
                            <img src={imageSrc} className="img-fluid" width="300px" alt={imageName} />
                        </div>)
                })}

            </Masonry>
        </div>
    )
}