import React from "react";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";

export default function(props, classes) {
    return (
        <ListItem
            style={{
                justifyContent: "center",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Typography
                style={{ color: "#efefef" }}
                component="h2"
                variant="h2"
            >
                An error ocurred with the code {props.code} and message
            </Typography>
            <Typography>
                {props.message}
            </Typography>

            <a 
                href="https://discord.gg/Qf7y579"
            >
                Tell developer about the issue
            </a>
        </ListItem>
    );
}
