import { useState } from "react";
import { NavDropdown } from "react-bootstrap";
import { HeaderLink } from "../../containers/Header/HeaderLink";

interface IWorldNaviagtionTab {
    worldName: string,
}

export function WorldNaviagtionTab(props: Readonly<IWorldNaviagtionTab>) {
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
    return <nav className="navbar navbar-expand-lg navbar-light, header">
        <div className="navbar-collapse text-start" id="navbarNav2">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <HeaderLink name="World" link={"/worlds/home/" + props.worldName} />
                </li>
                <li className="nav-item">
                    <NavDropdown title="Geography" id="basic-nav-dropdown2"
                        show={isDropdownOpenGeograpy}
                        onToggle={toggleDropdownGeograpy}
                    >
                        <HeaderLink name="planes" link={"/worlds/home/" + props.worldName + "/geograpy/planes"} handleSelect={handleSelectGeograpy} />
                        <NavDropdown.Divider />
                        <HeaderLink name="continents" link={"/worlds/home/" + props.worldName + "/geograpy/continents"} handleSelect={handleSelectGeograpy} />
                        <NavDropdown.Divider />
                        <HeaderLink name="regions" link={"/worlds/home/" + props.worldName + "/geograpy/regions"} handleSelect={handleSelectGeograpy} />
                        <NavDropdown.Divider />
                        <HeaderLink name="places" link={"/worlds/home/" + props.worldName + "/geograpy/places"} handleSelect={handleSelectGeograpy} />
                    </NavDropdown>
                </li>
                <li className="nav-item">
                    <NavDropdown title="Politics" id="basic-nav-dropdown2"
                        show={isDropdownOpenPolitics}
                        onToggle={toggleDropdownPolitics}
                    >
                        <HeaderLink name="kingdoms" link={"/worlds/home/" + props.worldName + "/politics/kingdoms"} handleSelect={handleSelectPolitics} />
                        <NavDropdown.Divider />
                        <HeaderLink name="counties" link={"/worlds/home/" + props.worldName + "/politics/counties"} handleSelect={handleSelectPolitics} />
                    </NavDropdown>
                </li>
                <li className="nav-item">
                    <HeaderLink name="cultures" link={"/worlds/home/" + props.worldName + "/cultures"} />
                </li>
                <li className="nav-item">
                    <NavDropdown title="Creatures" id="basic-nav-dropdown2"
                        show={isDropdownOpenRace}
                        onToggle={toggleDropdownRace}
                    >
                        <HeaderLink name="types" link={"/worlds/home/" + props.worldName + "/creatures/types"} handleSelect={handleSelectRaces} />
                        <NavDropdown.Divider />
                        <HeaderLink name="species" link={"/worlds/home/" + props.worldName + "/creatures/species"} handleSelect={handleSelectRaces} />
                        <NavDropdown.Divider />
                        <HeaderLink name="sub species" link={"/worlds/home/" + props.worldName + "/creatures/subspecies"} handleSelect={handleSelectRaces} />
                    </NavDropdown>
                </li>
            </ul>
        </div>
    </nav>
}