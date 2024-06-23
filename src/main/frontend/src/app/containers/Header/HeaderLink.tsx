import React from "react";
import { Link } from "react-router-dom";

interface IHeaderProps {
    name: string
}

export function HeaderLink(props: Readonly<IHeaderProps>) {
    return <Link className="nav-link" to={`/${props.name}`} style={{ textTransform: 'capitalize' }}>
        {props.name}
    </Link>
}