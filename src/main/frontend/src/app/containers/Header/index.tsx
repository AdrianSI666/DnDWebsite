import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'
import { HeaderLink } from "./HeaderLink";
import { NavDropdown } from "react-bootstrap";

export function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light, header">
            <div className="container-fluid">
                <span className="navbar-brand">Navigation</span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <HeaderLink name="home" />
                        </li>
                        <li className="nav-item">
                            <HeaderLink name="culture" />
                        </li>
                        <li className="nav-item">
                            <NavDropdown title="Races" id="basic-nav-dropdown">
                                <HeaderLink name="race" />
                                <NavDropdown.Divider />
                                <HeaderLink name="subrace" />
                            </NavDropdown>
                        </li>
                        <li className="nav-item">
                            <NavDropdown title="Places" id="basic-nav-dropdown">
                                <HeaderLink name="continent" />
                                <NavDropdown.Divider />
                                <HeaderLink name="kingdom" />
                                <NavDropdown.Divider />
                                <HeaderLink name="region" />
                                <NavDropdown.Divider />
                                <HeaderLink name="place" />
                            </NavDropdown>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>);
}