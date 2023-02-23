import React, { useState, useEffect, useCallback } from 'react';
import './Culture.css';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/masonary.css';
import { Button, Modal, Form, Accordion } from 'react-bootstrap'
import Masonry from 'react-masonry-css';

import Dropzone from '../Dropzone';

const CultureProfiles = () => {
  const localhost = "localhost"
  const [cultureData, setcultureData] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);
  const [id, setId] = useState(0);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const fetchCulture = () => {
    axios.get(`http://${localhost}:8090/culture/all`).then(res => {
      setcultureData(res.data)
    })
  }

  const removeImage = (cultureId, imageId) => {
    axios.delete(`http://${localhost}:8090/culture/delete/${cultureId}/${imageId}`).then(res => {
      setcultureData(res.data)
    })
  }

  useEffect(() => {
    fetchCulture();
  }, []);

  const onDrop = useCallback((acceptedFiles, id) => {
    const file = acceptedFiles[0];
    console.log(acceptedFiles);
    console.log(id);
    const formData = new FormData();
    formData.append("image", file);

    axios.post(
      `http://${localhost}:8090/culture/${id}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then((res) => {
        console.log("file uploaded successfully")
        setcultureData(res.data)
      }).catch(err => {
        console.log(err)
      })
  }, [])

  function addCulture(e, name, description) {
    e.preventDefault()
    const newCulture = {
      name,
      description
    }
    axios.post(`http://${localhost}:8090/culture/save`, newCulture)
      .then(response => setcultureData([...cultureData, response.data]))
      .catch(err => console.log(err))
  }

  function deleteCulture(e, id) {
    e.preventDefault()
    axios.delete(`http://${localhost}:8090/culture/delete/` + id)
      .then(() => setcultureData(cultureData.filter(item => item.id !== id)))
      .catch(err => console.log(err))
  }

  function setCulture(e, id, name, description) {
    e.preventDefault()
    const newCulture = {
      name,
      description
    }
    axios.put(`http://${localhost}:8090/culture/update/` + id, newCulture)
      .then(() => {
        cultureData.forEach(culture => {
          if (culture.id === id) {
            culture.name = name
            culture.description = description
          }
        })
        setcultureData([...cultureData])
      }
      )
      .catch(err => console.log(err))
  }
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const renderCulture = cultureData.map((culture) => {
    return (
      <Accordion key={culture.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={culture.id}>
          <Accordion.Header>{culture.name}</Accordion.Header>
          <Accordion.Body>
            <Button variant='danger' onClick={(e) => { deleteCulture(e, culture.id); }}>
              Delete
            </Button>
            <Form.Control as="textarea" rows={12} readOnly value={culture.description} />
            <Button variant='success' onClick={() => {
              setModalShow2(true)
              setId(culture.id)
              setName(culture.name)
              setDescription(culture.description)
            }}>
              Edit
            </Button>

            <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles, culture.id)} />
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {culture.images.map(oneimage => {
                const imageSrc = "data:image/jpg;base64," + oneimage.image
                const imageName = oneimage.name
                return (
                  <div key={oneimage.id}>
                    <h3>{imageName}</h3>
                    <img src={imageSrc} className="img-fluid" width="300px" />
                    <Button variant='danger' onClick={() => removeImage(culture.id, oneimage.id)}>Remove</Button>
                  </div>)
              })}
            </Masonry>

          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    )
  })

  return (
    <div>
      <div className="d-grid gap-2">
      <h1>Cultures</h1>
        <Button variant="success" onClick={() => {
          setModalShow(true);
          setName("")
          setDescription("")
        }}>
          Add culture
        </Button>
      </div>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Dodanie kultury
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            addCulture(e, name, description);
            setModalShow(false);
          }}>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Name</Form.Label>
              <Form.Control value={name} type="text" placeholder="Give name" onChange={e => setName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Description</Form.Label>
              <Form.Control value={description} name="description" as="textarea" rows="3" placeholder="Give description" onChange={e => setDescription(e.target.value)} />
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
      <Modal
        show={modalShow2}
        onHide={() => setModalShow2(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit culture
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            setCulture(e, id, name, description);
            setModalShow2(false);
          }}>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Name</Form.Label>
              <Form.Control value={name} type="text" onChange={e => setName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Description</Form.Label>
              <Form.Control value={description} name="description" as="textarea" rows="3" onChange={e => setDescription(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Change
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow2(false)}>Exit</Button>
        </Modal.Footer>
      </Modal>
      <div className='lightbox'>
        {renderCulture}
      </div>
    </div>
  )
}

function Culture() {
  return (
    <div className="Culture">
      <CultureProfiles />
    </div>
  );
}

export default Culture;
