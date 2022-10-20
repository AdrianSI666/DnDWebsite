import React, { useState, useEffect, useCallback } from 'react';
import './Region.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/masonary.css';
import { Button, Modal, Form, Accordion } from 'react-bootstrap'
import Masonry from 'react-masonry-css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import Dropzone from '../Dropzone';

const RegionProfiles = () => {
  const localhost = "192.168.0.139"
  let location = useLocation();
  const [regionData, setRegionData] = useState([]);
  const [cultureData, setCultureData] = useState([]);
  const [modalAdd, setModalAdd] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [modalAddPlace, setModalAddPlace] = React.useState(false);
  const [modalAddCulture, setModalAddCulture] = React.useState(false);
  const kingdomId = location.state.kingdomId;
  const kingdomName = location.state.kingdomName;
  const [id, setId] = useState(0);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const fetchRegion = () => {
    axios.get(`http://${localhost}:8090/region/kingdom/${kingdomId}`).then(res => {
      console.log(res)
      setRegionData(res.data)
    })
  }

  const fetchCulture = () => {
    axios.get(`http://${localhost}:8090/culture/all`)
    .then(response => {
      setCultureData(response.data)
    })
  }

  const removeImage = (regionId, imageId) => {
    axios.delete(`http://${localhost}:8090/region/delete/${regionId}/${imageId}/${kingdomId}`).then(res => {
      setRegionData(res.data)
    })
  }

  useEffect(() => {
    fetchRegion();
    fetchCulture();
  }, []);

  const onDrop = useCallback((acceptedFiles, id) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("image", file);

    axios.post(
      `http://${localhost}:8090/region/${id}/image/${kingdomId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then((res) => {
        console.log("file uploaded successfully")
        setRegionData(res.data)
      }).catch(err => {
        console.log(err)
      })
  }, [])

  function addRegion(e, name, description) {
    e.preventDefault()
    const newRegion = {
      name,
      description
    }
    axios.post(`http://${localhost}:8090/region/save/${kingdomId}`, newRegion)
      .then(response => setRegionData([...regionData, response.data]))
      .catch(err => console.log(err))
  }

  function deleteRegion(e, id) {
    e.preventDefault()
    axios.delete(`http://${localhost}:8090/region/delete/` + id)
      .then(() => setRegionData(regionData.filter(item => item.region.id !== id)))
      .catch(err => console.log(err))
  }

  function setRegion(e, id, name, description) {
    e.preventDefault()
    const newRegion = {
      name,
      description
    }
    axios.put(`http://${localhost}:8090/region/update/` + id, newRegion)
      .then(() => {
        regionData.forEach(data => {
          var region = data.region
          if (region.id === id) {
            region.name = name
            region.description = description
          }
        })
        setRegionData([...regionData])
      }
      )
      .catch(err => console.log(err))
  }

  function addPlace(e, name, id) {
    e.preventDefault()
    const newPlace = {
      name
    }
    axios.put(`http://${localhost}:8090/region/place/${id}`, newPlace)
      .then(() => fetchRegion())
      .catch(err => console.log(err))
  }

  function deletePlace(placeId) {
    axios.delete(`http://${localhost}:8090/region/place/${placeId}/${kingdomId}`)
      .then(response => setRegionData(response.data))
      .catch(err => console.log(err))
  }

  function addCulture(e, cultureName, id) {
    e.preventDefault()
    const newCulture = {
      cultureName
    }
    axios.put(`http://${localhost}:8090/region/culture/add/${id}`, newCulture)
      .then(() => fetchRegion())
      .catch(err => console.log(err))
  }

  function deleteCulture(regionId, cultureName) {
    axios.delete(`http://${localhost}:8090/region/culture/remove/${regionId}/${cultureName}/${kingdomId}`)
      .then(response => setRegionData(response.data))
      .catch(err => console.log(err))
  }

  const renderCulture = cultureData.map((culture) => {
    return (
      <option key={culture.id} value={culture.name}>
        {culture.name}
      </option>
    )
  })

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const renderRegion = regionData.map((data) => {
    var region = data.region
    var places = data.placeList
    var cultures = data.region.cultures
    let props = {
      regionId:region.id,
      regionName:region.name
      }
    return (
      <Accordion key={region.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={region.id}>
          <Accordion.Header>{region.name}</Accordion.Header>
          <Accordion.Body className="p-3">
          {`${region.description ? "" : region.description=""}`}
            <Button variant='danger' onClick={(e) => { deleteRegion(e, region.id); }}>
              Delete
            </Button>
            <Form.Control as="textarea" rows={12} readOnly value={region.description} />
            <Button variant='success' onClick={() => {
              setModalEdit(true)
              setId(region.id)
              setName(region.name)
              setDescription(region.description)
            }}>
              Edit
            </Button>
            <Button variant='info'>
              <Link className="nav-link" to="/place" state={props}>Check places</Link>
            </Button>
            <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles, region.id)} />
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {region.images.map(oneimage => {
                const imageSrc = "data:image/jpg;base64," + oneimage.image
                const imageName = oneimage.name
                return (
                  <div key={oneimage.id}>
                    <h3>{imageName}</h3>
                    <img src={imageSrc} className="img-fluid" width="300px" />
                    <Button variant='danger' onClick={() => removeImage(region.id, oneimage.id)}>Remove</Button>
                  </div>)
              })}
            </Masonry>
            <Container>
              <Row>
                <Col className="subObject">
                  <Button variant='success' onClick={() => {
                    setModalAddPlace(true)
                    setId(region.id)
                  }}>
                    Add place
                  </Button>
                  {places.map(oneplace => {
                  const placeName = oneplace.name
                  return (
                    <div key={oneplace.id}>
                      <h3>{placeName}</h3>
                      <Button variant='danger' onClick={() => deletePlace(oneplace.id)}>Remove</Button>
                    </div>)
                  })}
                </Col>
                <Col className="subObject">
                  <Button variant='success' onClick={() => {
                    setModalAddCulture(true)
                    setId(region.id)
                  }}>
                    Add culture
                  </Button>
                  {cultures.map(oneculture => {
                  const cultureName = oneculture.name
                  return (
                    <div key={oneculture.id}>
                      <h3>{cultureName}</h3>
                      <Button variant='danger' onClick={() => {deleteCulture(region.id, oneculture.name)}}>Remove</Button>
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

  return (
    <div>
      <div className="d-grid gap-2">
        <h1>Regions in {kingdomName}</h1>
        <Button variant="success" onClick={() => {
          setModalAdd(true);
          setName("")
          setDescription("")
        }}>
          Add region
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
            Adding region to {kingdomName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            addRegion(e, name, description);
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
            Edit region
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            setRegion(e, id, name, description);
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
        show={modalAddPlace}
        onHide={() => setModalAddPlace(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add place
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            addPlace(e, name, id);
            setModalAddPlace(false);
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
          <Button onClick={() => setModalAddPlace(false)}>Exit</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={modalAddCulture}
        onHide={() => setModalAddCulture(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add culture from list
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            addCulture(e, name, id);
            setModalAddCulture(false);
          }}>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Culture</Form.Label>
              <Form.Select value={name} onChange={e => setName(e.target.value)} >
                <option value="" label="Please select which one you want to add" disabled="disabled" selected/>
                {renderCulture}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalAddCulture(false)}>Exit</Button>
        </Modal.Footer>
      </Modal>
      <div className='lightbox'>
        {renderRegion}
      </div>
    </div>
  )
}

function Region() {
  return (
    <div className="Region">
      <RegionProfiles />
    </div>
  );
}

export default Region;
