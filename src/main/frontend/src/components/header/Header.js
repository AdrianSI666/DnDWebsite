import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'
import { Link } from 'react-router-dom';

function Header(){
    return(
        <nav className="navbar navbar-expand-lg navbar-light, header">
            <div className="container-fluid">
                <span className="navbar-brand">Navigation</span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                        <Link className="nav-link" to="/home">Home</Link>
                        </li>
                        <li className="nav-item">
                        <Link className="nav-link" to="/culture">Culture</Link>
                        </li>
                        <li className="nav-item">
                        <Link className="nav-link" to="/race">Race</Link>
                        </li>
                        <li className="nav-item">
                        <Link className="nav-link" to="/continent">Continent</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>);
}

export default Header;