import React, { useState, useEffect, useCallback } from 'react';
import './Subrace.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/masonary.css';
import { Button, Modal, Form, Accordion } from 'react-bootstrap'
import Masonry from 'react-masonry-css';

import Dropzone from '../Dropzone';

const SubraceProfiles = () => {
  let location = useLocation();
  const [subraceData, setSubraceData] = useState([]);
  const [saveModal, setSaveModal] = React.useState(false);
  const [updateModal, setUpdateModal] = React.useState(false);
  const raceId = location.state;
  const [id, setId] = useState(0);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const fetchSubrace = () => {
    console.log(raceId)
    axios.get(`http://localhost:8090/subrace/race/${raceId}`).then(res => {
      setSubraceData(res.data)
    })
  }

  const removeImage = (subraceId, imageId) => {
    axios.delete(`http://localhost:8090/subrace/delete/${subraceId}/${imageId}/${raceId}`).then(res => {
      console.log(res.data)
      setSubraceData(res.data)
    })
  }

  useEffect(() => {
    fetchSubrace();
  }, []);

  const onDrop = useCallback((acceptedFiles, id) => {
    const file = acceptedFiles[0];
    console.log(acceptedFiles);
    console.log(id);
    const formData = new FormData();
    formData.append("image", file);

    axios.post(
      `http://localhost:8090/subrace/${id}/image/${raceId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then((res) => {
        console.log("file uploaded successfully")
        setSubraceData(res.data)
      }).catch(err => {
        console.log(err)
      })
  }, [])

  function addSubrace(e, name, description) {
    e.preventDefault()
    const newSubrace = {
      name,
      description
    }
    axios.post(`http://localhost:8090/subrace/save/race/${raceId}`, newSubrace)
      .then(response => setSubraceData([...subraceData, response.data]))
      .catch(err => console.log(err))
  }

  function deleteSubrace(e, id) {
    e.preventDefault()
    axios.delete('http://localhost:8090/subrace/delete/' + id)
      .then(() => setSubraceData(subraceData.filter(item => item.id !== id)))
      .catch(err => console.log(err))
  }

  function setSubrace(e, id, name, description) {
    e.preventDefault()
    const newSubrace = {
      name,
      description
    }
    axios.put('http://localhost:8090/subrace/update/' + id, newSubrace)
      .then(() => {
        subraceData.forEach(data => {
          var subrace = data
          if (subrace.id === id) {
            subrace.name = name
            subrace.description = description
          }
        })
        setSubraceData([...subraceData])
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

  const renderSubrace = subraceData.map((data) => {
    var subrace = data
    
    return (
      <Accordion key={subrace.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={subrace.id}>
          <Accordion.Header>{subrace.name}</Accordion.Header>
          <Accordion.Body>
            {`${subrace.description ? "" : subrace.description=""}`}
            <h5>{subrace.description}</h5>
            <Button variant='success' onClick={() => {
              setUpdateModal(true)
              setId(subrace.id)
              setName(subrace.name)
              setDescription(subrace.description)
            }}>
              Edit
            </Button>
            <Button variant='danger' onClick={(e) => { deleteSubrace(e, subrace.id); }}>
              Delete
            </Button>

            <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles, subrace.id)} />
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {subrace.images.map(oneimage => {
                const imageSrc = "data:image/jpg;base64," + oneimage.image
                const imageName = oneimage.name
                return (
                  <div key={oneimage.id}>
                    <h3>{imageName}</h3>
                    <img src={imageSrc} className="img-thumbnail" width="300px" />
                    <button onClick={() => removeImage(subrace.id, oneimage.id)}>Remove</button>
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
        <Button variant="success" onClick={() => {
          setSaveModal(true);
          setName("")
          setDescription("")
        }}>
          Add subrace
        </Button>
      </div>
      <Modal
        show={saveModal}
        onHide={() => setSaveModal(false)}
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
            addSubrace(e, name, description);
            setSaveModal(false);
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
          <Button onClick={() => setSaveModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={updateModal}
        onHide={() => setUpdateModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit subrace
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            setSubrace(e, id, name, description);
            setUpdateModal(false);
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
          <Button onClick={() => setUpdateModal(false)}>Exit</Button>
        </Modal.Footer>
      </Modal>
      <div className='lightbox'>
        {renderSubrace}
      </div>
    </div>
  )
}

function Subrace() {
  return (
    <div className="Subrace">
      <SubraceProfiles />
    </div>
  );
}

export default Subrace;
