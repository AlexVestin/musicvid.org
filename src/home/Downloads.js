// --- Post bootstrap -----
import React from "react";
import Typography from "./modules/components/Typography";
import LayoutBody from "./modules/components/LayoutBody";
import AppAppBar from "./modules/views/AppAppBar";
import AppFooter from "./modules/views/AppFooter";
import Button from "./modules/components/Button";
import FAQItem from "./FAQitem";
import YouTube from "react-youtube";

const linuxPath =
    "https://s3.eu-central-1.amazonaws.com/mvid-build/musicvid_linux.tar.gz";
const windows64Path =
    "https://s3.eu-central-1.amazonaws.com/mvid-build/musicvid_windows64.zip";
const windows32Path =
    "https://s3.eu-central-1.amazonaws.com/mvid-build/musicvid_windows32.zip";
const buildPath = "https://s3.eu-central-1.amazonaws.com/mvid-build/build.zip";
const macPath =
    "https://s3.eu-central-1.amazonaws.com/mvid-build/musicvid_mac.zip";

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
                    Downloads are temporarily disabled due to costs
                </Typography>
            </LayoutBody>
            <AppFooter />
        </React.Fragment>
    );
}

/*
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
              <div style={{display: 'flex', flexDirection:'column', alignContent: 'center', alignItems: 'center', width: '100%'}}>
                <YouTube
                  videoId="MY-_dsdTlosI"
                  opts={{
                    width: '640',
                    height: '480'
                  }}
                />

                    <Button
                        color="secondary"
                        variant="contained"
                        size="large"
                        style={{textAlign: "center", marginTop: 10, width: 255}}
                        href={buildPath}
                
                    >
                        Download
                    </Button>
                </div>

            <Typography style={{textAlign:"center", marginTop: 40}} variant="h4">
                How to install & info
            </Typography>
                <ol>
                    <FAQItem title="Download the nw.js files and extract it to a folder"></FAQItem>   
                      <a href=" https://nwjs.io/downloads/"> https://nwjs.io/downloads/</a>
                    <FAQItem title="Download the musicvid source and extract it to the same folder as above">
                      Press the 'Download' button above to download
                    </FAQItem>

                    <FAQItem title="Download the ffmpeg file">
                       <a href="https://ffmpeg.zeranoe.com/builds/">https://ffmpeg.zeranoe.com/builds/</a>
                       Both the latest version (the dated one) or the release version works.

                       Extract the files and move the ffmpeg file to the same folder as the other files.
                    </FAQItem>   

                    <FAQItem title="Run the nw file">
                      You're good to go!
                    </FAQItem>   

                </ol>

                <ul style={{marginTop: 30}}>
                    <li>
                        <Typography>The program gets throttled when minimized, so keep it open when you export.</Typography>
                    </li>
                    
                    <li>
                        <Typography>It automatically uses the medium preset.</Typography>
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

            </LayoutBody>
            <AppFooter />
        </React.Fragment>
    );
}
*/
export default Terms;
