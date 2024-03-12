import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ApiError } from "../../../services/openapi";
import toast from "react-hot-toast";

interface IEntryModals {
  updateFunction: (id: number, name: string, description: string) => Promise<void>,
  id: number,
  name: string,
  description: string,
  categoryName: string,
}

export function EntryEditModal(props: IEntryModals) {
  const [modalShow, setModalShow] = useState(false);
  const [name, setName] = useState(props.name)
  const [description, setDescription] = useState(props.description)
  return (
    <div className="d-grid gap-2">
      <Button variant="success" onClick={() => {
        setModalShow(true);
      }}>
        Edit {props.categoryName}
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
              props.updateFunction(props.id!, name!, description!).then(() => {
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
              <Form.Control value={description} name="description" as="textarea" rows={3} placeholder="Give description" onChange={e => setDescription(e.target.value)} />
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