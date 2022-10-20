import React, { useState, useEffect, useCallback } from 'react';
import './Continent.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/masonary.css';
import { Button, Modal, Form, Accordion } from 'react-bootstrap'
import Masonry from 'react-masonry-css';


import Dropzone from '../Dropzone';

const ContinentProfiles = () => {
  const localhost = "192.168.0.139"
  const [continentData, setContinentData] = useState([]);
  const [modalAdd, setModalAdd] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [modalAddKingdom, setModalAddKingdom] = React.useState(false);
  const [id, setId] = useState(0);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const fetchContinent = () => {
    axios.get(`http://${localhost}:8090/continent/all`).then(res => {
      setContinentData(res.data)
    })
  }

  const removeImage = (continentId, imageId) => {
    axios.delete(`http://${localhost}:8090/continent/delete/${continentId}/${imageId}`).then(res => {
      console.log(res.data)
      setContinentData(res.data)
    })
  }

  useEffect(() => {
    fetchContinent();
  }, []);

  const onDrop = useCallback((acceptedFiles, id) => {
    const file = acceptedFiles[0];
    console.log(acceptedFiles);
    console.log(id);
    const formData = new FormData();
    formData.append("image", file);

    axios.post(
      `http://${localhost}:8090/continent/${id}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then((res) => {
        console.log("file uploaded successfully")
        setContinentData(res.data)
      }).catch(err => {
        console.log(err)
      })
  }, [])

  function addContinent(e, name, description) {
    e.preventDefault()
    const newContinent = {
      name,
      description
    }
    axios.post(`http://${localhost}:8090/continent/save`, newContinent)
      .then(response => setContinentData([...continentData, response.data]))
      .catch(err => console.log(err))
  }

  function deleteContinent(e, id) {
    e.preventDefault()
    axios.delete(`http://${localhost}:8090/continent/delete/` + id)
      .then(() => setContinentData(continentData.filter(item => item.continent.id !== id)))
      .catch(err => console.log(err))
  }

  function setContinent(e, id, name, description) {
    e.preventDefault()
    const newContinent = {
      name,
      description
    }
    axios.put('http://${localhost}:8090/continent/update/' + id, newContinent)
      .then(() => {
        continentData.forEach(data => {
          var continent = data.continent
          if (continent.id === id) {
            continent.name = name
            continent.description = description
          }
        })
        setContinentData([...continentData])
      }
      )
      .catch(err => console.log(err))
  }

  function addKingdom(e, name, id) {
    e.preventDefault()
    const newKingdom = {
      name
    }
    axios.put(`http://${localhost}:8090/continent/kingdom/${id}`, newKingdom)
      .then(() => fetchContinent())
      .catch(err => console.log(err))
  }

  function deleteKingdom(kingdomId) {
    axios.delete(`http://${localhost}:8090/continent/kingdom/${kingdomId}`)
      .then(response => setContinentData(response.data))
      .catch(err => console.log(err))
  }

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const renderContinent = continentData.map((data) => {
    var continent = data.continent
    var kingdoms = data.kingdomList
    let props = {
      continentId:continent.id,
      continentName:continent.name
      }
    return (
      <Accordion key={continent.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={continent.id}>
          <Accordion.Header>{continent.name}</Accordion.Header>
          <Accordion.Body>
          <Button variant='danger' onClick={(e) => { deleteContinent(e, continent.id); }}>
              Delete
            </Button>
            <Form.Control as="textarea" rows={12} readOnly value={continent.description} />
            <Button variant='success' onClick={() => {
              setModalEdit(true)
              setId(continent.id)
              setName(continent.name)
              setDescription(continent.description)
            }}>
              Edit
            </Button>
            <Button variant='info'>
              <Link className="nav-link" to="/kingdom" state={props}>Check kingdoms</Link>
            </Button>
            <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles, continent.id)} />
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {continent.images.map(oneimage => {
                const imageSrc = "data:image/jpg;base64," + oneimage.image
                const imageName = oneimage.name
                return (
                  <div key={oneimage.id}>
                    <h3>{imageName}</h3>
                    <img src={imageSrc} className="img-fluid" width="300px" />
                    <Button variant='danger' onClick={() => removeImage(continent.id, oneimage.id)}>Remove</Button>
                  </div>)
              })}
            </Masonry>
            <Button variant='success' onClick={() => {
              setModalAddKingdom(true)
              setId(continent.id)
            }}>
              Add kingdoms
            </Button>
            <div className="subObject">
              {kingdoms.map(onekingdom => {
                const kingdomName = onekingdom.name
                return (
                  <div key={onekingdom.id}>
                    <h3>{kingdomName}</h3>
                    <Button variant='danger' onClick={() => deleteKingdom(onekingdom.id)}>Remove</Button>
                  </div>)
              })}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    )
  })

  return (
    <div>
      <div className="d-grid gap-2">
      <h1>Continents</h1>
        <Button variant="success" onClick={() => {
          setModalAdd(true);
          setName("")
          setDescription("")
        }}>
          Add continent
        </Button>
      </div>
      <Modal
        show={modalAdd}
        onHide={() => setModalAdd(false)}
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
            addContinent(e, name, description);
            setModalAdd(false);
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
          <Button onClick={() => setModalAdd(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={modalEdit}
        onHide={() => setModalEdit(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit continent
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            setContinent(e, id, name, description);
            setModalEdit(false);
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
          <Button onClick={() => setModalEdit(false)}>Exit</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={modalAddKingdom}
        onHide={() => setModalAddKingdom(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add kingdom
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            addKingdom(e, name, id);
            setModalAddKingdom(false);
          }}>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Name</Form.Label>
              <Form.Control value={name} type="text" onChange={e => setName(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalAddKingdom(false)}>Exit</Button>
        </Modal.Footer>
      </Modal>
      <div className='lightbox'>
        {renderContinent}
      </div>
    </div>
  )
}

function Continent() {
  return (
    <div className="Continent">
      <ContinentProfiles />
    </div>
  );
}

export default Continent;
