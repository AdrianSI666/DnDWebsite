import React, { } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form } from 'react-bootstrap';

export function Home() {
  return (
    <div className="Home">
      <h1>Home Page</h1>
      <Form.Control as="textarea" rows={12} readOnly value={"Website to create and share information about your RPG worlds.\n Currently finishing Cultures, next races."} />
    </div>
  );
}
