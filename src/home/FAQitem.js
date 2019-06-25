import React from "react";
import Typography from "./modules/components/Typography";

export default function(props) {
    return (
        <div style={{marginTop: 10}}>
            <li id="attribution">
                {" "}
                <Typography variant="h6">{props.title}</Typography>
            </li>
            <Typography> {props.children}</Typography>
        </div>
    );
}
