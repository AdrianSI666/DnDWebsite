import React, {} from 'react';
import './Root.css';
import Header from '../header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';

function Root() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-10 col-xs-offset-1">
          <Header homeLink="Home" cultureLink="Culture"/>
        </div>
      </div>
      <div className='row'>
        <div className="Root">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Root;
