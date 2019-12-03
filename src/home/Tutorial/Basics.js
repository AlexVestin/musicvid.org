import React, { PureComponent } from "react";
import Typography from "../modules/components/Typography";
import LayoutBody from "../modules/components/LayoutBody";
export default class Basic extends PureComponent {
    render() {
        return (
            <LayoutBody margin marginBottom>
                <Typography
                    variant="h2"
                    gutterBottom
                    marked="center"
                    align="center"
                >
                Basics
                </Typography>


                <Typography
                    variant="h5"
                    gutterBottom
                    marked="center"
                    align="center"
                >
                Introduction
                </Typography>

                This will cover the basic useage; starting with a template and exporting. 
                Head over to the main page either by clicking the logo in the header, or 
                navigating to <a href="https://musicvid.org">https://musicvid.org</a>. If you scroll down
                you can see a few different projects to choose from. Click the one you like to get started!

                <br/>

            

                <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="left"
                >
                Overview
                </Typography>
                Here you can find the most important settings for the project. Not all project have settings here, but all projects have settings in the <b>layers </b>
                tab that will be described later.

                
                <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="left"
                >
                Audio
                </Typography>
                In this tab you can change the audio file you want to use, and also set the size of the FFT you want to use. The larger the fftSize the more
                frequencies will be picked up, but it wont be as reactive.


                <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="left"
                >
                Layers
                </Typography>
                This is the main part of the project. Here you can find all the available settings to control the visualizer. 
                It is split in to <b>layers </b> and <b>items </b> ( and also post-processing but that barely works, so we'll leave that out).
                There are different kinds of layers using different graphics apis. The available ones are <b>3D WebGL Scene (WebGL with perspective camera) </b>,
                <b>2D WebGL Scene (WebGL with orthographic camera)</b>, <b>2D canvas scene (Canvas 2D)</b>, and you add one simply by pressing addLayer. Each layer has a collection
                of <b>items</b>, and you can add and remove items from them. The layers are rendered top to bottom, so layers further down will be drawn on top.

                <br/>
                The items have controllers with <b>O </b> and <b>A </b> buttons, <b>O </b> adds the controller to the <b>Overview</b> tab and <b>A </b> allows
                you to link the controller value to an automation that's described below. 

                <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="left"
                >
                Automations
                </Typography>
                To use an automation you first have to create an automation and then link a controller to it. You do this by clicking the <b>A </b> 
                on a controller and  then <b>select new Automation</b>. Both the Math Input automation and the <b>Transform</b> tab in the link-menu
                uses <a href="https://mathjs.org/">math.js</a>, with the added variables <i>t=time, a=automation value, v= controller value</i>, so you can scale your Automations.
                
                <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="left"
                >
                Settings
                </Typography>
                Here you can find misc-settings, maybe most importantly change the resolution.

                <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="left"
                >
                Project
                </Typography>
                In the project tab you can save / download your project. If you're logged in the project gets saved to your profile.


                <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="left"
                >
                Exporting
                </Typography>
                Check out the <a href="https://musicvid.org/tutorial/exporting">exporting tutorial.</a>


                <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="left"
                >
                Keybindings
                </Typography>
                ctrl+s to save <br/>
                ctrl+e to enable all controls <br/>
                ctrl+y to reset all cameras <br/>
                f to fullscreen <br/>
                spacebar to toggle play
                ctrl+spacebar to stop
                shift+spacebar to stop and play
                ctrl+right/left to skip forwards/backwards 20s
                right/left to skip forwards/backwards 5s
            </LayoutBody>
        );
    }
}
