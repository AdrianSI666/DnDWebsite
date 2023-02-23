import React, { useState, useEffect, useCallback } from 'react';
import './Place.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/masonary.css';
import { Button, Modal, Form, Accordion } from 'react-bootstrap'
import Masonry from 'react-masonry-css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import Dropzone from '../Dropzone';

const PlaceProfiles = () => {
  const localhost = "localhost"
  let location = useLocation();
  const [placeData, setPlaceData] = useState([]);
  const [raceData, setRaceData] = useState([]);
  const [subraceData, setSubraceData] = useState([]);
  const [modalAdd, setModalAdd] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [modalAddRace, setModalAddRace] = React.useState(false);
  const [modalAddSubrace, setModalAddSubrace] = React.useState(false);
  const regionId = location.state.regionId;
  const regionName = location.state.regionName;
  const [id, setId] = useState(0);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const fetchPlace = () => {
    axios.get(`http://${localhost}:8090/place/region/${regionId}`).then(res => {
      setPlaceData(res.data)
    })
  }

  const fetchRace = () => {
    axios.get(`http://${localhost}:8090/race/all`)
    .then(response => {
      setRaceData(response.data)
    })
  }

  const fetchSubrace = () => {
    axios.get(`http://${localhost}:8090/subrace/all`)
    .then(response => {
      setSubraceData(response.data)
    })
  }

  const removeImage = (placeId, imageId) => {
    axios.delete(`http://${localhost}:8090/place/delete/${placeId}/${imageId}/${regionId}`).then(res => {
      setPlaceData(res.data)
    })
  }

  useEffect(() => {
    fetchPlace();
    fetchRace();
    fetchSubrace();
  }, []);

  const onDrop = useCallback((acceptedFiles, id) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("image", file);

    axios.post(
      `http://${localhost}:8090/place/${id}/image/${regionId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then((res) => {
        setPlaceData(res.data)
      }).catch(err => {
        console.log(err)
      })
  }, [])

  function addPlace(e, name, description) {
    e.preventDefault()
    const newPlace = {
      name,
      description
    }
    axios.post(`http://${localhost}:8090/place/save/${regionId}`, newPlace)
      .then(response => setPlaceData([...placeData, response.data]))
      .catch(err => console.log(err))
  }

  function deletePlace(e, id) {
    e.preventDefault()
    axios.delete(`http://${localhost}:8090/place/delete/` + id)
      .then(() => setPlaceData(placeData.filter(place => place.id !== id)))
      .catch(err => console.log(err))
  }

  function setPlace(e, id, name, description) {
    e.preventDefault()
    const newPlace = {
      name,
      description
    }
    axios.put(`http://${localhost}:8090/place/update/` + id, newPlace)
      .then(() => {
        placeData.forEach(place => {
          if (place.id === id) {
            place.name = name
            place.description = description
          }
        })
        setPlaceData([...placeData])
      }
      )
      .catch(err => console.log(err))
  }

  function addRace(e, raceId, id) {
    e.preventDefault()
    axios.put(`http://${localhost}:8090/place/race/add/${id}/${raceId}`)
      .then(() => fetchPlace())
      .catch(err => console.log(err))
  }

  function deleteRace(placeId, raceId) {
    axios.delete(`http://${localhost}:8090/place/race/remove/${placeId}/${raceId}/${regionId}`)
      .then(response => setPlaceData(response.data))
      .catch(err => console.log(err))
  }

  function addSubrace(e, subraceId, id) {
    e.preventDefault()
    axios.put(`http://${localhost}:8090/place/subrace/add/${id}/${subraceId}`)
      .then(() => fetchPlace())
      .catch(err => console.log(err))
  }

  function deleteSubrace(placeId, subraceName) {
    axios.delete(`http://${localhost}:8090/place/subrace/remove/${placeId}/${subraceName}/${regionId}`)
      .then(response => setPlaceData(response.data))
      .catch(err => console.log(err))
  }

  const renderRace = raceData.map((data) => {
    const race = data.race
    return (
      <option key={race.id} value={race.id}>
        {race.name}
      </option>
    )
  })

  const renderSubrace = subraceData.map((subrace) => {
    return (
      <option key={subrace.id} value={subrace.id}>
        {subrace.name}
      </option>
    )
  })

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const renderPlace = placeData.map((data) => {
    let place = data
    let races = data.races
    let subraces = data.subRaces
    return (
      <Accordion key={place.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={place.id}>
          <Accordion.Header>{place.name}</Accordion.Header>
          <Accordion.Body>
          {`${place.description ? "" : place.description=""}`}
          <Button variant='danger' onClick={(e) => { deletePlace(e, place.id); }}>
              Delete
            </Button>
            <Form.Control as="textarea" rows={12} readOnly value={place.description} />
            <Button variant='success' onClick={() => {
              setModalEdit(true)
              setId(place.id)
              setName(place.name)
              setDescription(place.description)
            }}>
              Edit
            </Button>
            <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles, place.id)} />
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {place.images.map(oneimage => {
                const imageSrc = "data:image/jpg;base64," + oneimage.image
                const imageName = oneimage.name
                return (
                  <div key={oneimage.id}>
                    <h3>{imageName}</h3>
                    <img src={imageSrc} className="img-fluid" width="300px" />
                    <Button variant='danger' onClick={() => removeImage(place.id, oneimage.id)}>Remove</Button>
                  </div>)
              })}
            </Masonry>
            <Container>
              <Row>
                <Col className="subObject">
                  <Button variant='success' onClick={() => {
                    setModalAddRace(true)
                    setId(place.id)
                  }}>
                    Add race
                  </Button>
                  {races.map(onerace => {
                  const raceName = onerace.name
                  return (
                    <div key={onerace.id}>
                      <h3>{raceName}</h3>
                      <Button variant='danger' onClick={() => deleteRace(place.id, onerace.id)}>Remove</Button>
                    </div>)
                  })}
                </Col>
                <Col className="subObject">
                  <Button variant='success' onClick={() => {
                    setModalAddSubrace(true)
                    setId(place.id)
                  }}>
                    Add subrace
                  </Button>
                  {subraces.map(onesubrace => {
                  const subraceName = onesubrace.name
                  return (
                    <div key={onesubrace.id}>
                      <h3>{subraceName}</h3>
                      <Button variant='danger' onClick={() => {deleteSubrace(place.id, onesubrace.id)}}>Remove</Button>
                    </div>)
                  })}
                </Col>
              </Row>
            </Container>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    )
  })
  let raceId;
  let subraceId;
  return (
    <div>
      <div className="d-grid gap-2">
        <h1>Places in {regionName}</h1>
        <Button variant="success" onClick={() => {
          setModalAdd(true);
          setName("")
          setDescription("")
        }}>
          Add place
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
            Adding place to {regionName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            addPlace(e, name, description);
            setModalAdd(false);
          }}>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Name</Form.Label>
              <Form.Control value={name} type="text" raceholder="Give name" onChange={e => setName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Description</Form.Label>
              <Form.Control value={description} name="description" as="textarea" rows="3" raceholder="Give description" onChange={e => setDescription(e.target.value)} />
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
            Edit place
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            setPlace(e, id, name, description);
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
        show={modalAddRace}
        onHide={() => setModalAddRace(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add race from list
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            addRace(e, raceId, id);
            setModalAddRace(false);
          }}>
            <Form.Group controlId="formBasicText">
              <Form.Label>Race</Form.Label>
              <Form.Select value={raceId} onChange={e => {raceId = e.target.value} }>
                <option value="" label="Please select which one you want to add" disabled="disabled" selected/>
                {renderRace}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalAddRace(false)}>Exit</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={modalAddSubrace}
        onHide={() => setModalAddSubrace(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add subrace from list
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            addSubrace(e, subraceId, id);
            setModalAddSubrace(false);
          }}>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Subrace</Form.Label>
              <Form.Select value={subraceId} onChange={e => {subraceId = e.target.value} } >
                <option value="" label="Please select which one you want to add" disabled="disabled" selected/>
                {renderSubrace}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalAddSubrace(false)}>Exit</Button>
        </Modal.Footer>
      </Modal>
      <div className='lightbox'>
        {renderPlace}
      </div>
    </div>
  )
}

function Place() {
  return (
    <div className="Place">
      <PlaceProfiles />
    </div>
  );
}

export default Place;
