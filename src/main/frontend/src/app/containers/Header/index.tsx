import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { Button, NavDropdown } from "react-bootstrap";
import JWTMenager from "../../../services/jwt/JWTMenager";
import { AuthenticationControllerService, OpenAPI } from "../../../services/openapi";
import './Header.css';
import { HeaderLink } from "./HeaderLink";
import useUserState from '../../../services/storage/UserStorage';
import toast from 'react-hot-toast';

export function Header() {
    const { userId, resetUser } = useUserState();
    const [isDropdownOpenRace, setDropdownOpenRace] = useState(false);
    const [isDropdownOpenGeograpy, setDropdownOpenGeograpy] = useState(false);
    const [isDropdownOpenPolitics, setDropdownOpenPolitics] = useState(false);
    const handleSelectRaces = () => {
        setDropdownOpenRace(false);
    };
    const toggleDropdownRace = () => {
        setDropdownOpenRace(!isDropdownOpenRace);
    };
    const toggleDropdownGeograpy = () => {
        setDropdownOpenGeograpy(!isDropdownOpenGeograpy)
    }
    const handleSelectGeograpy = () => {
        setDropdownOpenGeograpy(false);
    };
    const handleSelectPolitics = () => {
        setDropdownOpenPolitics(false);
    };
    const toggleDropdownPolitics = () => {
        setDropdownOpenPolitics(!isDropdownOpenPolitics)
    }
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
                            <HeaderLink name="home" link="/home" />
                        </li>
                        <li className="nav-item">
                            <HeaderLink name="worlds" link='/worlds' handleSelect={handleSelectGeograpy} />
                        </li>
                        <li className="nav-item">
                            <NavDropdown title="Geography" id="basic-nav-dropdown"
                                show={isDropdownOpenGeograpy}
                                onToggle={toggleDropdownGeograpy}
                            >
                                <HeaderLink name="planes" link="/geography/planes" handleSelect={handleSelectGeograpy} />
                                <NavDropdown.Divider />
                                <HeaderLink name="continents" link="/geography/continents" handleSelect={handleSelectGeograpy} />
                                <NavDropdown.Divider />
                                <HeaderLink name="regions" link="/geography/regions" handleSelect={handleSelectGeograpy} />
                                <NavDropdown.Divider />
                                <HeaderLink name="places" link="/geography/places" handleSelect={handleSelectGeograpy} />
                            </NavDropdown>
                        </li>
                        <li className="nav-item">
                            <NavDropdown title="Politics" id="basic-nav-dropdown"
                                show={isDropdownOpenPolitics}
                                onToggle={toggleDropdownPolitics}
                            >
                                <HeaderLink name="kingdoms" link="/politics/kingdoms" handleSelect={handleSelectPolitics} />
                                <NavDropdown.Divider />
                                <HeaderLink name="counties" link="/politics/counties" handleSelect={handleSelectPolitics} />
                            </NavDropdown>
                        </li>
                        <li className="nav-item">
                            <HeaderLink name="cultures" link="/cultures" />
                        </li>
                        <li className="nav-item">
                            <NavDropdown title="Creatures" id="basic-nav-dropdown"
                                show={isDropdownOpenRace}
                                onToggle={toggleDropdownRace}
                            >
                                <HeaderLink name="types" link="/creatures/types" handleSelect={handleSelectRaces} />
                                <NavDropdown.Divider />
                                <HeaderLink name="species" link="/creatures/species" handleSelect={handleSelectRaces} />
                                <NavDropdown.Divider />
                                <HeaderLink name="sub species" link="/creatures/subspecies" handleSelect={handleSelectRaces} />
                            </NavDropdown>
                        </li>
                        {!userId ? <><li className="nav-item">
                            <HeaderLink name="login" link='/login' />
                        </li><li className="nav-item">
                                <HeaderLink name="signup" link='/signup' />
                            </li></> : null}
                        {userId ? <>
                            <li className="nav-item">
                                <HeaderLink name="profile" link='/user/home' />
                            </li>
                            <li>
                                <Button onClick={() => {
                                    OpenAPI.TOKEN = JWTMenager.getToken();
                                    toast.promise(AuthenticationControllerService.signOut(userId)
                                        .then((_) => {
                                            resetUser()
                                            JWTMenager.deleteTokens()
                                        })
                                        .catch((e) => {
                                            resetUser()
                                            JWTMenager.deleteTokens()
                                        }), {
                                        loading: 'Processing...',
                                        success: `Logged out.`,
                                        error: () => `There has been error on the server, please try again later.`
                                    });
                                }}>Sign out</Button>
                            </li>
                        </> : null}

                    </ul>
                </div>
            </div>
        </nav >);
}