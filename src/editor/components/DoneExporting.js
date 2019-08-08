import React from "react";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Link from "@material-ui/core/Link";



export default function(props, classes) {
    let f = "/"
    if(!window.__localExporter) {
        f = window.URL.createObjectURL(props.fileBlob);
    }
    
    

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

            {!window.__localExporter ? 
                 <Link
                 color="secondary"
                 style={{ textDecoration: "underline" }}
                 download={props.fileName}
                 href={f}
             >
                 Click here to download if the download didn't start automatically
             </Link>

             : 
                <Typography
                    style={{ color: "#efefef", textAlign: "center" }}
                    component="h6"
                    variant="h6"
                >
                    File should be located in the same folder as the executable is in!
                    <br/>

                    <a style={{cursor: "pointer"}} href="#" onClick={window.openFolder}>Click here to open containing folder</a>
                </Typography>
            }
           
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
            />
        </ListItem>
    );
}
