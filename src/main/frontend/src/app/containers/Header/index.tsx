import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'
import { HeaderLink } from "./HeaderLink";
import { NavDropdown } from "react-bootstrap";
import JWTMenager from "../../../services/jwt/JWTMenager";

export function Header() {
    const [isDropdownOpenRace, setDropdownOpenRace] = useState(false);
    const [isDropdownOpenMaps, setDropdownOpenMaps] = useState(false);
    const handleSelect = () => {
        setDropdownOpenRace(false);
    };
    const toggleDropdownRace = () => {
        setDropdownOpenRace(!isDropdownOpenRace);
    };
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
                            <NavDropdown title="Races" id="basic-nav-dropdown"
                            show={isDropdownOpenRace}
                            onSelect={(ek, ev) => console.log("yes")} 
                            onToggle={toggleDropdownRace}
                            >
                                <HeaderLink name="races" handleSelect={handleSelect} />
                                <NavDropdown.Divider />
                                <HeaderLink name="subraces" handleSelect={handleSelect} />
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
                        {(JWTMenager.getUser() === null) && (<><li className="nav-item">
                            <HeaderLink name="login" />
                        </li><li className="nav-item">
                                <HeaderLink name="signup" />
                            </li></>)}
                        {(JWTMenager.getUser() != null) && (<li className="nav-item">
                            <HeaderLink name="profile" />
                        </li>)}

                    </ul>
                </div>
            </div>
        </nav>);
}