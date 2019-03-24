import React from "react";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";

import LinearProgress from "@material-ui/core/LinearProgress";

export default function(props) {

    let progressText = "Calculating time left...";
    if(props.progress > 0.01) {
        let mins = Math.floor(props.timeLeft / 60);
        if(mins === 0) {
            progressText = "Nearly done!"
        }else {
            progressText = "Around " + String(mins) + " min left"
        }
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
                Exporting
            </Typography>

            <Typography
                style={{ color: "#efefef", textAlign:"center" }}
                component="h6"
                variant="h6"
            >

                { progressText }
                <br/>
                {" " + String(props.progress * 100).substr(0, 6) + "% done"}
            </Typography>
            <div className={props.classes.root}>
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
                Check out the creators that made this video possible in the meantime! (but don't close the tab)
            </Typography>

            <Typography
                style={{ color: "#efefef" }}
                component="h6"
                variant="h6"
            >
                (Also the exporting takes a while)
            </Typography>
            
        </ListItem>
    );
}
