import React, { useState } from 'react';
import { UserControllerService } from '../../../../services/openapi';
import { LoginFunction } from './loadingPageFunctions';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export function Login() {

  // const [userName,setUserName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const {getAuthJWT} = LoginFunction()

  const {register,handleSubmit,formState:{errors}} = useForm();

 
  const cridentials = {
    email:"testowy@testowy.pl",
    password:"12345678"
  }
  

  return (
    <div className="Login">
      <h1>Login Page</h1>
      <form onSubmit={ (e) => {
        e.preventDefault();
        fetch('http://localhost:8090/api/v1/authenticate',{
          method:"POST",
          headers: {
            'Content-Type': 'application/json',},
          body:JSON.stringify(cridentials)
        }).then(
          res => console.log(res)
        ).then(data => console.log(data)).catch(error => console.error(error));
      }}>
      <div className="form-group">
        <label htmlFor="InputEmail">Email address</label>
        <input 
          type="email" 
          className="form-control" 
          id="InputEmail" 
          aria-describedby="emailHelp" 
          placeholder="Enter email"
          />

      </div>
      <div className="form-group">
        <label htmlFor="InputPassword1">Password</label>
        <input 
          type="password" 
          className="form-control" 
          id="InputPassword1" 
          placeholder="Password"
          />
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
    </div>
  );
}
