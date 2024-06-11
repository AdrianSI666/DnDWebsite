import { Card, Col, Container, Form, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import Masonry from "react-masonry-css";
import { EntryFullDTO } from "../../../services/openapi";
import Dropzone from "../Dropzone";
import { AddNewDescriptionModal } from "../modals/addNewDescriptionModal";
import { DeleteConfirmationModal } from "../modals/deleteConfirmModal";
import { EditDescriptionModal } from "../modals/editDescriptionModal";
import { GriddingNotes, IGridNotes } from "../../utils/griddingNotes";
import { useState } from "react";

interface IFullEntryAccordionBody {
    categoryName: string;
    deleteImageButtonActionText: string;
    entryFullDTO: EntryFullDTO,

    addNewDescriptionToEntry: (id: number, title: string, description: string) => Promise<void>;
    updateDescription: (entryId: number, descriptionId: number, title: string, description: string) => Promise<void>;
    deleteDescriptionFromEntry: (entryId: number, descriptionId: number) => Promise<void>;

    saveImageToEntry: (acceptedFiles: Blob, entryId: number) => Promise<void>;
    deleteImageFromEntry: (entryId: number, imageId: number) => Promise<void>;
}

const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
};

export function FullEntryAccordionBody(props: Readonly<IFullEntryAccordionBody>) {
    const { grindNotes } = GriddingNotes();
    let init: IGridNotes = {
        rows: []
    };
    const [grid, setGrid] = useState(init)
    if (props.entryFullDTO.descriptions!.length > 0) {
        grindNotes(props.entryFullDTO.descriptions!).then(res => {
            setGrid(res)
        })
    }
    return (
        <div>
            <h3>Description board</h3>
            <Container fluid className="noteBoard min-vw-10 min-vh-10">
            <AddNewDescriptionModal id={props.entryFullDTO.object?.id!}
                addNewDescriptionToEntry={props.addNewDescriptionToEntry}
                addButtonActionText={"Add new description to this " + props.categoryName} />
                {grid.rows.map(row => {
                    return (
                        <Row className="my-masonry-grid mt-1" key={row.number}>
                            {row.descriptions.map(desc => {
                                let style = "text-center w-auto my-masonry-grid_column w-" + desc.size;
                                return (
                                    <Col md={{ span: Math.round(desc.size! / 25)*3}} key={desc.id}>
                                        <Card className={style} border="warning" key={desc.id}>
                                            <Card.Header>{desc.title}</Card.Header>
                                            <Card.Body>
                                                <Form.Control as="textarea" rows={Math.round(desc.size! / 5)} cols={desc.size} readOnly value={desc.text} />
                                            </Card.Body>
                                            <Card.Footer>
                                                <EditDescriptionModal updateFunction={props.updateDescription} entryId={props.entryFullDTO.object?.id!} descriptionId={desc.id!} title={desc.title!} description={desc.text!} />
                                                <DeleteConfirmationModal deleteButtonActionText={"Delete this note"} deleteObjectsInRelation={props.deleteDescriptionFromEntry} title={desc.title!} id={props.entryFullDTO.object?.id!} secondId={desc.id} />
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
            <Dropzone onDrop={(acceptedFiles: Blob) =>
                toast.promise(props.saveImageToEntry(acceptedFiles, props.entryFullDTO.object?.id!), {
                    loading: 'Saving...',
                    success: `Successfully added image.`,
                    error: (err) => `Operation failed.\n ${err}`,
                })} />
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
                            <DeleteConfirmationModal deleteButtonActionText={props.deleteImageButtonActionText} deleteObjectsInRelation={props.deleteImageFromEntry} title={oneImage.name!} id={props.entryFullDTO.object?.id!} secondId={oneImage.id} />
                        </div>)
                })}

            </Masonry>
        </div>
    )
}