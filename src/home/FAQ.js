// --- Post bootstrap -----
import React from "react";
import Typography from "./modules/components/Typography";
import LayoutBody from "./modules/components/LayoutBody";
import AppAppBar from "./modules/views/AppAppBar";
import AppFooter from "./modules/views/AppFooter";
import { Link } from 'react-router-dom'
import FAQItem from './FAQitem'
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
                    Frequently Asked Questions
                </Typography>

                <ul>
                    <FAQItem title="What is musicvid.org?">
                        In short, it's an in-website editor where you can create and export videos of audio visualizations. 
                    </FAQItem>

                    <FAQItem title="Who is making the site?">
                        I code the website (GamleGaz on discord or KFriedChicken on reddit), in my free time.
                        Most of the visualization have been done by other people, while I code mainly the structure of
                        the site.     
                    </FAQItem>

                    <FAQItem title="How do I use the site?">
                       Check out the <Link to="/tutorial">tutorials</Link>
                    </FAQItem>

                    <FAQItem title="Something broke/doesn't work!">
                        The site is developed to work in Chrome/FireFox, so make sure that you're
                        using a recent version of either of those. After that you can find help in the bugs channel 
                        on the <a href="https://discord.gg/Qf7y579">discord</a>, or email me at musicvid.org@gmail.com.     
                    </FAQItem>

                    <FAQItem title="Export times are slow, is it possible to speed them up?">
                        The desktop version has faster exports, however is less stable than the web version.
                        Functionality for faster exports is being added to browsers at the moment, which will
                        be added when they're implemented and stable.
                    </FAQItem>

                     
                    <FAQItem title="It doesn't work on my phone?">
                       The website is targeting desktop for the time being. Exporting video from a website 
                       on mobile would be deathly slow.
                    </FAQItem>

                    <FAQItem title="What is the site made with?">
                        It's mostly JavaScript (React), using datgui for controllers and Three.js for animations.
                        The exporter is a webassembly port of FFMpeg.
                    </FAQItem>

                    <FAQItem title="I want the visualizer to look in another way, is that possible?">
                        Probably! Most of the features implemented are requested by users, so drop in to 
                        the <a href="https://discord.gg/Qf7y579">discord</a> and tell me about it and 
                        I'll see if it can be added. 
                    </FAQItem>

                    <FAQItem title="Are the images free to use?">
                        Yes! The images are grabbed from Pexel. So the pexel license applies to them.
                    </FAQItem>

                    <FAQItem title="What does the desktop version do?">
                        The desktop version is basically a wrapper around the website, with the added 
                        possibility to use a faster way of exporting that isn't available for the web.
                        The wrapper is using software I'm not super familiar with, and therefore might 
                        introduce some instability.
                    </FAQItem>

                    <FAQItem title="What 'add attribution visibly to my content' means:">
                        If there is a description option to your upload add the
                        aforementioned attribution to this. If this is not an
                        option, the attributions should be added via a comment.
                        If adding the attribution is not possible for the upload
                        then the video needs to visually display the
                        attribution. This can be done in the settings tab of
                        your composition by toggling "includeAttribution" on.
                    </FAQItem>

                    <FAQItem title="Can you port this to VST/VJR/other?">
                       Porting this isn't really viable, but I might make a separate version at a later point. 
                    </FAQItem>                        
                </ul>
            </LayoutBody>
            <AppFooter />
        </React.Fragment>
    );
}

export default Terms;
