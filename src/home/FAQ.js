// --- Post bootstrap -----
import React from "react";
import Typography from "./modules/components/Typography";
import LayoutBody from "./modules/components/LayoutBody";
import AppAppBar from "./modules/views/AppAppBar";
import AppFooter from "./modules/views/AppFooter";
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
                    <FAQItem title="What 'add attribution visibly to my content' means:">
                        If there is a description option to your upload add the
                        aforementioned attribution to this. If this is not an
                        option, the attributions should be added via a comment.
                        If adding the attribution is not possible for the upload
                        then the video needs to visually display the
                        attribution. This can be done in the settings tab of
                        your composition by toggling "includeAttribution" on.
                    </FAQItem>

                    <FAQItem title="What does 'MIT' mean?">
                        You can read more about the MIT license <a href="https://tldrlegal.com/license/mit-license">here</a>. It
                        basically mean that you are allowed to share and modify the work freely, but you can't claim that you made it.
                    </FAQItem>   

                    <FAQItem title="Who pays for this?">
                        I do!
                    </FAQItem>   

                    <FAQItem title="Is this footer properly placed yet?">
                        No!
                    </FAQItem>   

                    
                </ul>
            </LayoutBody>
            <AppFooter />
        </React.Fragment>
    );
}

export default Terms;
