import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ApiError, EntryDTO } from "../../../services/openapi";
import toast from "react-hot-toast";

interface IAddFromListModal {
    addExistingObjectToRelation: (coreObjectId: number, objectToAddId: number, objectName: string, objectDescription: string) => Promise<void>;
    fillTheListWithObjects: () => Promise<void | EntryDTO[]>
    categoryName: string;
    id?: number;
}

export function AddFromListModal(props: Readonly<IAddFromListModal>) {
    const [modalShow, setModalShow] = useState(false);
    const [idOfLinkedObject, setIdOfLinkedObject] = useState(-1)
    const [objectsList, setObjectsList] = useState(Array<EntryDTO>)
    return (
        <div className="d-grid gap-2 p-1">
            <Button variant="success" onClick={() => {
                if (objectsList.length === 0) props.fillTheListWithObjects()
                    .then(result => setObjectsList(result!))
                setModalShow(true);
            }}>
                Add {props.categoryName}
            </Button>
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Adding {props.categoryName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        let name = objectsList.find(object => object.id === idOfLinkedObject)?.name;
                        toast.promise(
                        props.addExistingObjectToRelation(props.id!, idOfLinkedObject, name!, objectsList.find(object => object.id === idOfLinkedObject)?.description!).then(() => {
                            setModalShow(false);
                          }).catch((err: ApiError) => {
                            let errorMessage = "Unexpected error, try again.";
                            if(err.status === 409) errorMessage = `Selected ${props.categoryName} is already on this list.`
                            throw(errorMessage)
                          }), {
                            loading: 'Saving...',
                            success: `Sucesfully added ${name}.`,
                            error: (err) => `Operation failed.\n ${err}`,
                          });
                    }}>
                        <Form.Select value={idOfLinkedObject} onChange={e => setIdOfLinkedObject(parseInt(e.target.value))}>
                            <option value="-1" disabled>Chose {props.categoryName}</option>
                            {objectsList.map((object) => {
                                return <option value={object.id} key={object.id}>{object.name}</option>
                            })}
                        </Form.Select>
                        <Button variant="success" type="submit">
                            Add
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setModalShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}