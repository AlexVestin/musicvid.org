import React from "react";
import Typography from "./modules/components/Typography";

export default function(props) {
    return (
        <React.Fragment>
            <li id="attribution">
                {" "}
                <Typography variant="h6">{props.title}</Typography>
            </li>
            <Typography> {props.children}</Typography>
        </React.Fragment>
    );
}
