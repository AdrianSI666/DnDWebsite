import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import toast from 'react-hot-toast';
import { ApiError } from "../../../services/openapi";

interface IAddNewEntryModal {
  addNewEntry?: (name: string, description: string) => Promise<void>;
  addNewSubEntryToRelation?: (id: number, name: string, description: string) => Promise<void>;
  categoryName: string;
  id?: number;
}

export function AddNewEntryModal(props: Readonly<IAddNewEntryModal>) {
  const [modalShow, setModalShow] = useState(false);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  return (
    <div className="d-grid gap-2 p-1">
      <Button variant="success" onClick={() => {
        setModalShow(true);
        setName("")
        setDescription("")
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
            if (props.addNewEntry) {
              toast.promise(props.addNewEntry(name, description).then(() => {
                setModalShow(false);
              }).catch((err: ApiError) => {
                let errorMessage = err.body.message;
                if (err.status === 409) errorMessage = "Your given name is taken, provide other. It must be unique."
                throw (errorMessage)
              }), {
                loading: 'Saving...',
                success: `Sucesfully added ${name}.`,
                error: (err) => `Operation failed.\n ${err}`,
              }
              );
            }
            else if (props.addNewSubEntryToRelation) {
              toast.promise(props.addNewSubEntryToRelation(props.id!, name, description).then(() => {
                setModalShow(false);
              }).catch((err: ApiError) => {
                let errorMessage = err.body.message;
                if (err.status === 409) errorMessage = "Your given name is taken, provide other. It must be unique."
                throw (errorMessage)
              }), {
                loading: 'Saving...',
                success: `Sucesfully added ${name}.`,
                error: (err) => `Operation failed.\n ${err}`,
              });
            }
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