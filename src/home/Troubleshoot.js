import React, { PureComponent } from "react";
import Typography from "./modules/components/Typography";
import LayoutBody from "./modules/components/LayoutBody";
import AppAppBar from "./modules/views/AppAppBar";
import AppFooter from "./modules/views/AppFooter";
export default class Basic extends PureComponent {
    render() {
        return (
            <div>
            <AppAppBar></AppAppBar>
            <LayoutBody margin marginBottom>
                <Typography
                    variant="h2"
                    gutterBottom
                    marked="center"
                    align="center"
                   
                >
                Troubleshooting
                </Typography>


                <Typography
                    variant="h5"
                    gutterBottom
                    marked="center"
                    align="center"
                >
                     Most issues come from using the web version of this project, if it's available to you please try to use the desktop version.
                </Typography>
               

                <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="left"
                    style={{marginTop: 30}}
                >
                I dont get audio with my video (specifically on mac)
                </Typography>

                This is a known issue on the mac web version for some people, and there isn't a fix for this available. You could replace the 
                audio of the file using FFmpeg or similar. 


                <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="left"
                >
               The exported video has audio but my visuals are black
                </Typography>
                This is probably an issue with your media player. 
                Some media players (like windows media player) have issues with the pixel format 
                used in the video. However, platforms like youtube and other social medias 
                re-encodes videos so these will usually work there. VLC can also play the files. 
                If you want to change the pixel format you can re-encode the files using either FFmpeg or Handbrake.js

                     
                <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="left"
                >
                The site crashes when I press the layers tab
                </Typography>
                This seems to be another mac/chrome-specific issue that there isn't a fix for, but users using a different browser (eg. FireFox) 
                hasn't reported this issue.   

                        
                <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="left"
                >
                My exporting froze
                </Typography>
                The web-version often crashes for unexplained reasons, best is to try and use the desktop version.

                <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="left"
                >
                My exporting is really slow
                </Typography>
                Probably not something wrong, but mostly a web issue. The exporting is done on the user computer and the web-version has a lot slower exports.
                If you use the desktop version it can get throttled if it's minimized or put in the background, which will make the export take
                (a lot) longer.
              
            </LayoutBody>
            <AppFooter></AppFooter>
            </div>
          
        );
    }
}
