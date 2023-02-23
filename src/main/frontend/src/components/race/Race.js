import React, { useState, useEffect, useCallback } from 'react';
import './Race.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/masonary.css';
import { Button, Modal, Form, Accordion } from 'react-bootstrap'
import Masonry from 'react-masonry-css';


import Dropzone from '../Dropzone';

const RaceProfiles = () => {
  const localhost = "localhost"
  const [raceData, setRaceData] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);
  const [modalShow3, setModalShow3] = React.useState(false);
  const [id, setId] = useState(0);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const fetchRace = () => {
    axios.get(`http://${localhost}:8090/race/all`).then(res => {
      setRaceData(res.data)
    })
  }

  const removeImage = (raceId, imageId) => {
    axios.delete(`http://${localhost}:8090/race/delete/${raceId}/${imageId}`).then(res => {
      setRaceData(res.data)
    })
  }

  useEffect(() => {
    fetchRace();
  }, []);

  const onDrop = useCallback((acceptedFiles, id) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("image", file);

    axios.post(
      `http://${localhost}:8090/race/${id}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then((res) => {
        console.log("file uploaded successfully")
        setRaceData(res.data)
      }).catch(err => {
        console.log(err)
      })
  }, [])

  function addRace(e, name, description) {
    e.preventDefault()
    const newRace = {
      name,
      description
    }
    axios.post(`http://${localhost}:8090/race/save`, newRace)
      .then(response => setRaceData([...raceData, response.data]))
      .catch(err => console.log(err))
  }

  function deleteRace(e, id) {
    e.preventDefault()
    axios.delete(`http://${localhost}:8090/race/delete/` + id)
      .then(() => setRaceData(raceData.filter(item => item.race.id !== id)))
      .catch(err => console.log(err))
  }

  function setRace(e, id, name, description) {
    e.preventDefault()
    const newRace = {
      name,
      description
    }
    axios.put(`http://${localhost}:8090/race/update/` + id, newRace)
      .then(() => {
        raceData.forEach(data => {
          let race = data.race
          if (race.id === id) {
            race.name = name
            race.description = description
          }
        })
        setRaceData([...raceData])
      }
      )
      .catch(err => console.log(err))
  }

  function addSubrace(e, name, id) {
    e.preventDefault()
    const newSubrace = {
      name
    }
    axios.put(`http://${localhost}:8090/race/subrace/` + id, newSubrace)
      .then(() => fetchRace())
      .catch(err => console.log(err))
  }

  function deleteSubrace(subraceId) {
    axios.delete(`http://${localhost}:8090/race/subrace/` + subraceId,)
      .then(response => setRaceData(response.data))
      .catch(err => console.log(err))
  }

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const renderRace = raceData.map((data) => {
    let race = data.race
    let subraces = data.subraceList
    let props = {
      raceId:race.id,
      raceName:race.name
      }
    return (
      <Accordion key={race.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={race.id}>
          <Accordion.Header>{race.name}</Accordion.Header>
          <Accordion.Body>
            <Button variant='danger' onClick={(e) => { deleteRace(e, race.id); }}>
              Delete
            </Button>
            <Form.Control as="textarea" rows={12} readOnly value={race.description} />
            <Button variant='success' onClick={() => {
              setModalShow2(true)
              setId(race.id)
              setName(race.name)
              setDescription(race.description)
            }}>
              Edit
            </Button>
            <Button variant='info'>
              <Link className="nav-link" to="/subrace" state={props}>Check subclasses</Link>
            </Button>
            <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles, race.id)} />
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {race.images.map(oneimage => {
                const imageSrc = "data:image/jpg;base64," + oneimage.image
                const imageName = oneimage.name
                return (
                  <div key={oneimage.id}>
                    <h3>{imageName}</h3>
                    <img src={imageSrc} className="img-fluid" width="300px" />
                    <Button variant='danger' onClick={() => removeImage(race.id, oneimage.id)}>Remove</Button>
                  </div>)
              })}
            </Masonry>
            <Button variant='success' onClick={() => {
              setModalShow3(true)
              setId(race.id)
            }}>
              Add subrace
            </Button>
            <div className="subObject">
              {subraces.map(onesubrace => {
                const subraceName = onesubrace.name
                return (
                  <div key={onesubrace.id}>
                    <h3>{subraceName}</h3>
                    <Button variant='danger' onClick={() => deleteSubrace(onesubrace.id)}>Remove</Button>
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
      <h1>Races</h1>
        <Button variant="success" onClick={() => {
          setModalShow(true);
          setName("")
          setDescription("")
        }}>
          Add race
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
            addRace(e, name, description);
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
            Edit race
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            setRace(e, id, name, description);
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

      <Modal
        show={modalShow3}
        onHide={() => setModalShow3(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add subrace
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            addSubrace(e, name, id);
            setModalShow3(false);
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
          <Button onClick={() => setModalShow3(false)}>Exit</Button>
        </Modal.Footer>
      </Modal>
      <div className='lightbox'>
        {renderRace}
      </div>
    </div>
  )
}

function Race() {
  return (
    <div className="Race">
      <RaceProfiles />
    </div>
  );
}

export default Race;
