import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ApiError } from "../../../services/openapi";
import toast from "react-hot-toast";

interface IEditDescriptionModals {
  updateFunction: (descriptionId: number, title: string, description: string) => Promise<void>,
  descriptionId: number,
  title: string,
  description: string
}

export function EditDescriptionModal(props: IEditDescriptionModals) {
  const [modalShow, setModalShow] = useState(false);
  const [title, setTitle] = useState(props.title)
  const [description, setDescription] = useState(props.description)
  return (
    <div className="d-grid gap-2" onClick={(e) => {
      e.stopPropagation();}}>
      <Button variant="success" onClick={(_) => {
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
            Editing description
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            toast.promise(
              props.updateFunction(props.descriptionId!, title!, description!).then(() => {
                setModalShow(false);
              }).catch((err: ApiError) => {
                let errorMessage = err.body.message;
                if (err.status === 409) errorMessage = `Name that you want to change to is already taken.`
                throw (errorMessage)
              }), {
              loading: 'Saving...',
              success: `Sucesfully updated ${title}.`,
              error: (err) => `Operation failed.\n ${err}`,
            }
            );
          }}>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Title</Form.Label>
              <Form.Control value={title} type="text" placeholder="Give title" onChange={e => setTitle(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Description</Form.Label>
              <Form.Control value={description} title="description" as="textarea" rows={3} maxLength={255} placeholder="Give description" onChange={e => setDescription(e.target.value)} />
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