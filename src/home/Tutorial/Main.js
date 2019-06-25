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
        description: "How to edit and export a video using the site"
    },

    {
        path: "advanced",
        title: "Advanced",
        description: "More advanced features, such as creating and sharing projects."
    },

    {
        path: "audio_analysers",
        title: "Audio Analysers",
        description: "How the audio analysers work and what settings to use"
    },

    {
        path: "automations",
        title: "Automations",
        description: "How the automations work and how to use them in your projects"
    },

    {
        path: "exporting",
        title: "Exporting",
        description: "What the export settings does, and how to make sure your video looks great"
    }
];

function Terms() {
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

                <ul>
                    {tutorials.map(tut => {
                        return (
                            <div key={tut.path} className={classes.tutorialContainer}>
                                <Link
                                    className={classes.link}
                                    to={"/tutorial/" + tut.path}
                                >
                                    <h4>{tut.title}</h4>
                                    {tut.description}
                                </Link>
                            </div>
                        );
                    })}
                </ul>
            </LayoutBody>
        </React.Fragment>
    );
}

export default Terms;
