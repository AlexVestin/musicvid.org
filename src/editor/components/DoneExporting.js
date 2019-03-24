import React from "react";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Link from "@material-ui/core/Link";

export default function(props, classes) {
    const f = window.URL.createObjectURL(props.fileBlob);
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
                Done Exporting!
            </Typography>
            <Link color="secondary" style={{textDecoration: "underline"}} download={props.fileName} href={f}>Click here to download if the download didn't start automatically</Link>
            <div className={classes.root}>
                <LinearProgress
                    color="secondary"
                    variant="determinate"
                    value={props.progress * 100}
                />
            </div>
            <Typography
                style={{ color: "#efefef" }}
                component="h6"
                variant="h6"
            >
               
            </Typography>
        </ListItem>
    );
}
