import React from "react";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";


import LinearProgress from "@material-ui/core/LinearProgress";


let formatTime = (seconds) => {
    let m = String(Math.floor((seconds % 3600) / 60));
    let s = String(seconds % 60).split(".")[0];

    if (m.length === 1) m = "0" + m;
    if (s.length === 1) s = "0" + s;

    let formatted = m + ":" + s;


    return formatted;
}



export default function(props) {
    
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

                { props.progress > 0.01 ? formatTime(props.timeLeft) + " left": "Calculating time left..."}
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
                Check out the contributors in the meantime! (but don't navigate
                away from or close the tab)
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
