import React, { PureComponent } from 'react'
import Typography from "../../modules/components/Typography";
import LayoutBody from "../../modules/components/LayoutBody";
import classes from "../Tutorial.module.css";
import { Link } from "react-router-dom";

const tutorials = [
    {
        path: "theory",
        title: "Audio Theory",
        description: "Theory of audio and sampling"
    },

    {
        path: "impact",
        title: "Impact Analyser",
        description: "How the impact analyser works"
    },

    {
        path: "spectrum",
        title: "Spectrum Analyser",
        description: "How the spectrum analyser wors"
    },
];


export default class Audio extends PureComponent {
    render() {
        return (


            <div>
                <LayoutBody margin marginBottom>

                <div style={{width: "100%", display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
                    <Link to="/tutorial">{"< Back to tutorials"}</Link>                
                    <Link to="/tutorial/audio_analysers/theory">Audio Theory ></Link>
                </div>
                <Typography
                    variant="h3"
                    gutterBottom
                    marked="center"
                    align="center"
                >
                    Audio Analyser Tutorials
                </Typography>

                <Typography

                >
                    This website is built on two different types of audio analysers. The first, and simplest,
                    is the <b>impact analyser</b>. This analyser is used to determine if there has been a strong impact in the 
                    audio (often times a kickdrum). The other type is the <b>spectrum analyser</b>. This is used to analyse the full 
                    spectrum of the audio and is used in items like JSNation or Monstercat Bar Visualizer.

                    <br/>
                    <br/>


                    To explain The audio analyser tutorial will be split in to three parts: basics of audio, the 
                    impact analyser and the spectrum analyser. If you're not intereseted in the theory
                    behind the analyser, or why settings appear as they do you can skip the first part and 
                    go straight to the impact analyser tutorial.
                </Typography>
                {tutorials.map(tut => {
                        return (
                            <div key={tut.path} className={classes.tutorialContainer}>
                                <Link
                                    className={classes.link}
                                    to={"/tutorial/audio_analysers/" + tut.path}
                                >
                                    <h4>{tut.title}</h4>
                                    {tut.description}
                                </Link>
                            </div>
                        );
                    })}

                </LayoutBody>

            </div>
        )
    }
}
