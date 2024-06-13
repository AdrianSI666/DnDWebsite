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
                            <HeaderLink name="cultures" />
                        </li>
                        <li className="nav-item">
                            <NavDropdown title="Races" id="basic-nav-dropdown">
                                <HeaderLink name="races" />
                                <NavDropdown.Divider />
                                <HeaderLink name="subraces" />
                            </NavDropdown>
                        </li>
                        <li className="nav-item">
                            <NavDropdown title="Places" id="basic-nav-dropdown">
                                <HeaderLink name="worlds" />
                                <NavDropdown.Divider />
                                <HeaderLink name="planes" />
                                <NavDropdown.Divider />
                                <HeaderLink name="continents" />
                                <NavDropdown.Divider />
                                <HeaderLink name="kingdoms" />
                                <NavDropdown.Divider />
                                <HeaderLink name="regions" />
                                <NavDropdown.Divider />
                                <HeaderLink name="places" />
                            </NavDropdown>
                        </li>
                        <li className="nav-item">
                            <HeaderLink name="beasts" />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>);
}