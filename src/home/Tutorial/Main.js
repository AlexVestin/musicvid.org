// --- Post bootstrap -----
import React from "react";
import Typography from "../modules/components/Typography";
import LayoutBody from "../modules/components/LayoutBody";

import classes from "./Tutorial.module.css";
import { Link } from "react-router-dom";

const tutorials = [
    {
        path: "basics",
        title: "Basics",
        description: "How to edit and export a video using the site",
    },



    {
        path: "audio_analysers",
        title: "Audio Analysers",
        description: "How the audio analysers work and what settings to use"
    },

    {
        path: "exporting",
        title: "Exporting",
        description:
            "What the export settings does, and how to make sure your video looks great"
    }
];

function Terms(props) {
    return (
        <React.Fragment>
            <LayoutBody margin marginBottom>
                <Typography
                    variant="h3"
                    gutterBottom
                    marked="center"
                    align="center"
                >
                    Tutorials
                </Typography>

                <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="center"
                >
                    All tutorials are not done yet but will show up here when they are ready
                </Typography>


                {tutorials.map(tut => {
                    return (
                        <ul
                            className={!tut.disabled ? classes.tutorialContainer : ""}
                            onClick={() =>
                                props.history.push("/tutorial/" + tut.path)
                            }
                            style={{ color: tut.disabled ? "#afafaf" : "" }}
                        >
                            <h4>{tut.title}</h4>
                            {tut.description}
                        </ul>
                    );
                })}
            </LayoutBody>
        </React.Fragment>
    );
}

export default Terms;
