import React, { useState, useEffect, useCallback } from 'react';
import './Kingdom.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/masonary.css';
import { Button, Modal, Form, Accordion } from 'react-bootstrap'
import Masonry from 'react-masonry-css';


import Dropzone from '../Dropzone';

const KingdomProfiles = () => {
  let location = useLocation();
  const [kingdomData, setKingdomData] = useState([]);
  const [modalAdd, setModalAdd] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [modalAddRegion, setModalAddRegion] = React.useState(false);
  const continentId = location.state.continentId;
  const continentName = location.state.continentName;
  const [id, setId] = useState(0);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const fetchKingdom = () => {
    axios.get(`http://localhost:8090/kingdom/continent/${continentId}`).then(res => {
      setKingdomData(res.data)
    })
  }

  const removeImage = (kingdomId, imageId) => {
    axios.delete(`http://localhost:8090/kingdom/delete/${kingdomId}/${imageId}`).then(res => {
      console.log(res.data)
      setKingdomData(res.data)
    })
  }

  useEffect(() => {
    fetchKingdom();
  }, []);

  const onDrop = useCallback((acceptedFiles, id) => {
    const file = acceptedFiles[0];
    console.log(acceptedFiles);
    console.log(id);
    const formData = new FormData();
    formData.append("image", file);

    axios.post(
      `http://localhost:8090/kingdom/${id}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then((res) => {
        console.log("file uploaded successfully")
        setKingdomData(res.data)
      }).catch(err => {
        console.log(err)
      })
  }, [])

  function addKingdom(e, name, description) {
    e.preventDefault()
    const newKingdom = {
      name,
      description
    }
    axios.post(`http://localhost:8090/kingdom/save/${continentId}`, newKingdom)
      .then(response => setKingdomData([...kingdomData, response.data]))
      .catch(err => console.log(err))
  }

  function deleteKingdom(e, id) {
    e.preventDefault()
    axios.delete('http://localhost:8090/kingdom/delete/' + id)
      .then(() => setKingdomData(kingdomData.filter(item => item.kingdom.id !== id)))
      .catch(err => console.log(err))
  }

  function setKingdom(e, id, name, description) {
    e.preventDefault()
    const newKingdom = {
      name,
      description
    }
    axios.put('http://localhost:8090/kingdom/update/' + id, newKingdom)
      .then(() => {
        kingdomData.forEach(data => {
          var kingdom = data.kingdom
          if (kingdom.id === id) {
            kingdom.name = name
            kingdom.description = description
          }
        })
        setKingdomData([...kingdomData])
      }
      )
      .catch(err => console.log(err))
  }

  function addRegion(e, name, id) {
    e.preventDefault()
    const newRegion = {
      name
    }
    axios.put(`http://localhost:8090/kingdom/region/${id}`, newRegion)
      .then(() => fetchKingdom())
      .catch(err => console.log(err))
  }

  function deleteRegion(regionId) {
    axios.delete(`http://localhost:8090/kingdom/region/${regionId}`)
      .then(response => setKingdomData(response.data))
      .catch(err => console.log(err))
  }

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const renderKingdom = kingdomData.map((data) => {
    var kingdom = data.kingdom
    var regions = data.regionList
    let props = {
      kingdomId:kingdom.id,
      kingdomName:kingdom.name
      }
    return (
      <Accordion key={kingdom.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={kingdom.id}>
          <Accordion.Header>{kingdom.name}</Accordion.Header>
          <Accordion.Body>
          {`${kingdom.description ? "" : kingdom.description=""}`}
            <h5>{kingdom.description}</h5>
            <Button variant='success' onClick={() => {
              setModalEdit(true)
              setId(kingdom.id)
              setName(kingdom.name)
              setDescription(kingdom.description)
            }}>
              Edit
            </Button>
            <Button variant='danger' onClick={(e) => { deleteKingdom(e, kingdom.id); }}>
              Delete
            </Button>
            <Button variant='info'>
              <Link className="nav-link" to="/region" state={props}>Check regions</Link>
            </Button>
            <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles, kingdom.id)} />
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {kingdom.images.map(oneimage => {
                const imageSrc = "data:image/jpg;base64," + oneimage.image
                const imageName = oneimage.name
                return (
                  <div key={oneimage.id}>
                    <h3>{imageName}</h3>
                    <img src={imageSrc} className="img-thumbnail" width="300px" />
                    <button onClick={() => removeImage(kingdom.id, oneimage.id)}>Remove</button>
                  </div>)
              })}
            </Masonry>
            <Button variant='success' onClick={() => {
              setModalAddRegion(true)
              setId(kingdom.id)
            }}>
              Add regions
            </Button>
            <div>
              {regions.map(oneregion => {
                const regionName = oneregion.name
                return (
                  <div key={oneregion.id}>
                    <h3>{regionName}</h3>
                    <button onClick={() => deleteRegion(oneregion.id)}>Remove</button>
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
        <h1>Kingdoms in {continentName}</h1>
        <Button variant="success" onClick={() => {
          setModalAdd(true);
          setName("")
          setDescription("")
        }}>
          Add kingdom
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
            Adding kingdom to {continentName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            addKingdom(e, name, description);
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
            Edit kingdom
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            setKingdom(e, id, name, description);
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
        show={modalAddRegion}
        onHide={() => setModalAddRegion(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add region
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            addRegion(e, name, id);
            setModalAddRegion(false);
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
          <Button onClick={() => setModalAddRegion(false)}>Exit</Button>
        </Modal.Footer>
      </Modal>
      <div className='lightbox'>
        {renderKingdom}
      </div>
    </div>
  )
}

function Kingdom() {
  return (
    <div className="Kingdom">
      <KingdomProfiles />
    </div>
  );
}

export default Kingdom;
