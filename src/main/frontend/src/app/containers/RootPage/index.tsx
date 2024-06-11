import React, { } from 'react';
import './root.css';
import { Header } from '../Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export function Root() {
  return (
    <div className="container">
      <header>
        <script src="http://localhost:8097"></script>
      </header>
      <div className="row">
        <div className="col-xs-10 col-xs-offset-1">
          <Header />
        </div>
      </div>
      <div className='row'>
        <div className="Root">
        <Toaster
              position="top-center"
              reverseOrder={false}
            />
          <Outlet />
        </div>
      </div>
    </div>
  );
}