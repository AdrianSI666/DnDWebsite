import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ApiError } from "../../../services/openapi";
import toast from "react-hot-toast";

interface IEditEntryModals {
  updateFunction: (id: number, name: string, shortDescription: string) => Promise<void>,
  id: number,
  name: string,
  shortDescription: string,
  categoryName: string,
}

export function EditEntryModal(props: IEditEntryModals) {
  const [modalShow, setModalShow] = useState(false);
  const [name, setName] = useState(props.name)
  const [shortDescription, setShortDescription] = useState(props.shortDescription)
  return (
    <div className="d-grid gap-2" onClick={(e) => {
      e.stopPropagation();}}>
      <Button variant="success" onClick={(e) => {
        setModalShow(true);
      }}>
        Edit
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
            Editing {props.categoryName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            toast.promise(
              props.updateFunction(props.id!, name!, shortDescription!).then(() => {
                setModalShow(false);
              }).catch((err: ApiError) => {
                let errorMessage = err.body.message;
                if (err.status === 409) errorMessage = `Name that you want to change to is already taken.`
                throw (errorMessage)
              }), {
              loading: 'Saving...',
              success: `Sucesfully updated ${name}.`,
              error: (err) => `Operation failed.\n ${err}`,
            }
            );
          }}>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Name</Form.Label>
              <Form.Control value={name} type="text" placeholder="Give name" onChange={e => setName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Description</Form.Label>
              <Form.Control value={shortDescription} name="description" as="textarea" rows={3} maxLength={255} placeholder="Give short description" onChange={e => setShortDescription(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update
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