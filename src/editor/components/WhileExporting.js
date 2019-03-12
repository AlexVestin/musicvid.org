import React from "react";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
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
