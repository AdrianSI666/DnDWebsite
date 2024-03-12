import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ApiError } from "../../../services/openapi";
import toast from "react-hot-toast";

interface ICultureModals {
  deleteFunction?: (id: number) => Promise<void>;
  deleteFunctionInRelation?: (id: number, secondId: number) => Promise<void>;
  categoryName: string,
  title: string,
  id: number,
  secondId?: number
}

export function DeleteConfirmationModal(props: ICultureModals) {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className="d-grid gap-2">
      <Button variant="danger" onClick={() => {
        setModalShow(true);
      }}>
        Delete {props.categoryName}
      </Button>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.categoryName} delete confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault()
            if (props.deleteFunction)  {
              toast.promise(props.deleteFunction(props.id).then(() => {
                setModalShow(false);
              }).catch((err: ApiError) => {
                let errorMessage = "Unexpected error, try again.";
                if (err.status !== 500) errorMessage = err.message
                throw (errorMessage)
              }), {
                loading: 'Saving...',
                success: `Sucesfully deleted.`,
                error: (err) => `Operation failed.\n ${err}`,
              }
              );
            }
            else if (props.deleteFunctionInRelation) {
              toast.promise(props.deleteFunctionInRelation(props.id, props.secondId!).then(() => {
                setModalShow(false);
              }).catch((err: ApiError) => {
                let errorMessage = "Unexpected error, try again.";
                if (err.status !== 500) errorMessage = err.message
                throw (errorMessage)
              }), {
                loading: 'Saving...',
                success: `Sucesfully deleted.`,
                error: (err) => `Operation failed.\n ${err}`,
              });
            }
          }}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Are you sure you want to delete: {props.title}</Form.Label>
              <Button className='ms-5' variant="danger" type="submit">
                Delete
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={(e) => {
            e.preventDefault()
            setModalShow(false)
          }
          }>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}