import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import toast from 'react-hot-toast';
import { ApiError } from "../../../services/openapi";

interface IAddNewDescriptionModal {
  addNewDescriptionToEntry: (id: number, title: string, description: string) => Promise<void>;
  addButtonActionText: string;
  id: number;
}

export function AddNewDescriptionModal(props: Readonly<IAddNewDescriptionModal>) {
  const [modalShow, setModalShow] = useState(false);
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  return (
    <div className="d-grid gap-2 p-1">
      <Button variant="success" onClick={() => {
        setModalShow(true);
        setTitle("")
        setDescription("")
      }}>
        {props.addButtonActionText}
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
            {props.addButtonActionText}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            toast.promise(props.addNewDescriptionToEntry(props.id!, title, description).then(() => {
                setModalShow(false);
              }).catch((err: ApiError) => {
                console.log(err)
                throw (err.body.message)
              }), {
                loading: 'Saving...',
                success: `Sucesfully added ${title}.`,
                error: (err) => `Operation failed.\n ${err}`,
              });
          }}>

            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Description title</Form.Label>
              <Form.Control value={title} type="text" placeholder="Give title to this note" onChange={e => setTitle(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Description</Form.Label>
              <Form.Control value={description} title="description" as="textarea" rows={3} placeholder="Give description" onChange={e => setDescription(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
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