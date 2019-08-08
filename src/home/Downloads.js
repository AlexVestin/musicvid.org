// --- Post bootstrap -----
import React from "react";
import Typography from "./modules/components/Typography";
import LayoutBody from "./modules/components/LayoutBody";
import AppAppBar from "./modules/views/AppAppBar";
import AppFooter from "./modules/views/AppFooter";
import Button from './modules/components/Button';
import FAQItem from './FAQitem'

const linuxPath = "https://s3.eu-central-1.amazonaws.com/mvid-build/musicvid_linux.tar.gz";
const windowsPath = "https://s3.eu-central-1.amazonaws.com/mvid-build/musicvid_windows.zip";
const macPath = "https://s3.eu-central-1.amazonaws.com/mvid-build/musicvid_mac.zip";


function Terms() {
    return (
        <React.Fragment>
            <AppAppBar />
            <LayoutBody margin marginBottom>
                <Typography
                    variant="h3"
                    gutterBottom
                    marked="center"
                    align="center"
                >
                    Download the desktop client
                </Typography>

                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <Button
                        color="secondary"
                        variant="contained"
                        size="large"
                        style={{textAlign: "center", marginTop: 10, width: 255}}
                        href={windowsPath}
                
                    >
                        Windows x64
                    </Button>

                    <Button
                        color="secondary"
                        variant="contained"
                        size="large"
                        style={{textAlign: "center", marginTop: 10, width: 255}}
                        href={linuxPath}
                              
                    >
                        Linux x64
                    </Button>

                    <Button
                        disabled={true}
                        color="primary"
                        variant="contained"
                        size="large"
                        style={{textAlign: "center", marginTop: 10, width: 255}}
                        href={macPath}            
                    >
                        Mac x64
                    </Button>
                </div>


            <Typography style={{textAlign:"center", marginTop: 40}} variant="h4">
                How to install & info
            </Typography>
                <ol>
                    <FAQItem title="Download and extract the zipped files">
                        The unzipped files are around 300MB in size, so make sure you have room
                        on your computer
                    </FAQItem>

                    <FAQItem title="Run the musicvid.org file">
                        On Windows just open and double click the <i>musicvid.org</i> file, on linux run /path/to/musicvid.org
                    </FAQItem>   

                    <FAQItem title="Use the client like you would on the web">
                        
                    </FAQItem>   
                    
                </ol>

                <ul style={{marginTop: 30}}>
                    <li>
                        <Typography>The program gets throttled when minimized, so keep it open when you export.</Typography>
                    </li>
                    
                    <li>
                        <Typography>It automatically uses a default bitrate (chosen by the encoder) and preset.</Typography>
                    </li>

                    <li>
                        <Typography>
                            The client doesn't auto-update so it needs to be redownloaded when a new version is available. 
                            In the more recent versions you can find the date of the version in the help section.
                        </Typography>
                    </li>

                    <li>
                        <Typography>Exported videos are found in the same folder as the <i>musicvid.org</i> file.</Typography>
                    </li>

                    <li>
                        <Typography>When you have exported a video you need to reload the program manually.</Typography>
                    </li>
                </ul>

                <Typography style={{textAlign:"center", marginTop: 40, color: "red"}} variant="h4">
                    Disclaimer
                </Typography>
                <Typography variant="h6" style={{textAlign:"center"}}>
    
                    The desktop version is still very unstable, and I would love to get reports of any issues. 
                    Mac version is still under development.
                </Typography>
            </LayoutBody>
            <AppFooter />
        </React.Fragment>
    );
}

export default Terms;
