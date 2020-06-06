// --- Post bootstrap -----
import React from "react";
import Typography from "./modules/components/Typography";
import LayoutBody from "./modules/components/LayoutBody";
import AppAppBar from "./modules/views/AppAppBar";
import AppFooter from "./modules/views/AppFooter";
import { Link } from "react-router-dom";
import FAQItem from "./FAQitem";

import info from "util/version";

function Terms() {
    return (
        <React.Fragment>
            <AppAppBar />

            <LayoutBody margin marginBottom>
                <Typography
                    align="center"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center"
                    }}
                >
                    musicvid.org version:
                    <div style={{ color: "rgb(255, 51, 102)", marginLeft: 4 }}>
                        {info.version / 1000}
                    </div>
                </Typography>

                <Typography
                    align="center"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center"
                    }}
                >
                    Last updated:
                    <div style={{ color: "rgb(255, 51, 102)", marginLeft: 4 }}>
                        {info.updated}
                    </div>
                </Typography>

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
                        In short, it's an in-website editor where you can create
                        and export videos of audio visualizations.
                    </FAQItem>

                    <FAQItem title="Who made this site?">
                        I code the website (GamleGaz on discord or KFriedChicken
                        on reddit), in my free time. Most of the visualization
                        have been done by other people, while I code mainly the
                        structure of the site.
                    </FAQItem>

                    <FAQItem title="Is the site currently active?">
                        No, it is not being actively developed, however it is
                        still usable.
                    </FAQItem>

                    <FAQItem title="Can I use my exported video commercially?">
                        Yes, however if there are licensed items in your project
                        the attribution clause applies to these. This means that
                        the author of the visualizer needs to be credited if you
                        share the video. You can find more info on this in the{" "}
                        <i>
                            What 'add attribution visibly to my content' means:
                        </i>{" "}
                        point a bit further down on this page.
                    </FAQItem>

                    <FAQItem title="How do I use the site?">
                        Check out the <Link to="/tutorial">tutorials</Link>
                    </FAQItem>

                    <FAQItem title="Something broke/doesn't work!">
                        The site is developed to work in Chrome/FireFox, so make
                        sure that you're using a recent version of either of
                        those. Try to refreshing the page, since some bugs may
                        have caused the browser to hang. Also you can check out
                        the{" "}
                        <Link to="/troubleshooting"> troubleshooting page</Link>
                    </FAQItem>

                    <FAQItem title="Export times are slow, is it possible to speed them up?">
                        The desktop version has faster exports, however is less
                        stable than the web version.
                    </FAQItem>

                    <FAQItem title="What is the site made with?">
                        It's mostly JavaScript (React), using datgui for
                        controllers and Three.js for animations. The exporter is
                        a webassembly port of FFMpeg.
                    </FAQItem>

                    <FAQItem title="I want the visualizer to look in another way, is that possible?">
                        Probably! Most of the features implemented are requested
                        by users, so drop in to the{" "}
                        <a href="https://discord.gg/Qf7y579">discord</a> and
                        tell me about it and I'll see if it can be added.
                    </FAQItem>

                    <FAQItem title="Are the images free to use?">
                        Yes! The images are grabbed from Pexel. So the{" "}
                        <a href="https://www.pexels.com/photo-license/">
                            Pexel license
                        </a>{" "}
                        applies to them.
                    </FAQItem>

                    <FAQItem title="What does the desktop version do?">
                        The desktop version is basically a wrapper around the
                        website, with the added possibility to use a faster way
                        of exporting that isn't available for the web. The
                        wrapper is using software I'm not super familiar with,
                        and therefore might introduce some instability.
                    </FAQItem>

                    <FAQItem title="Do I need to attribute my content">
                        There is a text box that shows up when you hit export
                        that will instruct you if you need to add attribution.
                        Do not contact any of the creators regarding permissions
                        or site issues.
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
                        Porting this isn't really viable, but I might make a
                        separate version at a later point.
                    </FAQItem>
                </ul>
            </LayoutBody>
            <AppFooter />
        </React.Fragment>
    );
}

export default Terms;
