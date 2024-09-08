import React from "react";
import { Link } from "react-router-dom";

interface IHeaderProps {
    name: string,
    handleSelect?: () => void
}

export function HeaderLink(props: Readonly<IHeaderProps>) {
    return <Link className="nav-link" to={`/${props.name}`} style={{ textTransform: 'capitalize' }} onClick={() => {
        if(props.handleSelect) props.handleSelect()
    }}>
        {props.name}
    </Link>
}