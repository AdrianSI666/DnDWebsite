import React, { } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Form } from 'react-bootstrap';

export function Register() {
  return (
    <div className="Register">
      <h1>Register Page</h1>
      <form>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Email address</label>
        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputPassword1">Password</label>
        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputPassword1">Repeat password</label>
        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
      </div>

      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
    </div>
  );
}
