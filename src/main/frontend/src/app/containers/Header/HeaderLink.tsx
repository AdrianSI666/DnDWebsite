import { NavLink } from "react-router-dom";

interface IHeaderProps {
    name: string,
    link: string,
    handleSelect?: () => void
}

export function HeaderLink(props: Readonly<IHeaderProps>) {
    return <NavLink className="nav-link" to={props.link} style={{ textTransform: 'capitalize' }} onClick={() => {
        if(props.handleSelect) props.handleSelect()
    }}>
        {props.name}
    </NavLink>
}