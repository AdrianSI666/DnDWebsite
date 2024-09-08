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
    const { userId } = useUserState();
    const { resetUser } = useUserState();
    const [isDropdownOpenRace, setDropdownOpenRace] = useState(false);
    const [isDropdownOpenMaps, setDropdownOpenMaps] = useState(false);
    const handleSelectRaces = () => {
        setDropdownOpenRace(false);
    };
    const toggleDropdownRace = () => {
        setDropdownOpenRace(!isDropdownOpenRace);
    };
    const toggleDropdownMaps = () => {
        setDropdownOpenMaps(!isDropdownOpenMaps)
    }
    const handleSelectMaps = () => {
        setDropdownOpenMaps(false);
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
                                onToggle={toggleDropdownRace}
                            >
                                <HeaderLink name="races" handleSelect={handleSelectRaces} />
                                <NavDropdown.Divider />
                                <HeaderLink name="subraces" handleSelect={handleSelectRaces} />
                            </NavDropdown>
                        </li>
                        <li className="nav-item">
                            <NavDropdown title="Places" id="basic-nav-dropdown"
                                show={isDropdownOpenMaps}
                                onToggle={toggleDropdownMaps}
                            >
                                <HeaderLink name="worlds" handleSelect={handleSelectMaps} />
                                <NavDropdown.Divider />
                                <HeaderLink name="planes" handleSelect={handleSelectMaps} />
                                <NavDropdown.Divider />
                                <HeaderLink name="continents" handleSelect={handleSelectMaps} />
                                <NavDropdown.Divider />
                                <HeaderLink name="kingdoms" handleSelect={handleSelectMaps} />
                                <NavDropdown.Divider />
                                <HeaderLink name="regions" handleSelect={handleSelectMaps} />
                                <NavDropdown.Divider />
                                <HeaderLink name="places" handleSelect={handleSelectMaps} />
                            </NavDropdown>
                        </li>
                        {!userId ? <><li className="nav-item">
                            <HeaderLink name="login" />
                        </li><li className="nav-item">
                                <HeaderLink name="signup" />
                            </li></> : null}
                        {userId ? <>
                            <li className="nav-item">
                                <HeaderLink name="profile" />
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