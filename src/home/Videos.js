// --- Post bootstrap -----
import React from "react";
import AppAppBar from "./modules/views/AppAppBar";
import AppFooter from "./modules/views/AppFooter";
import FeaturedVideos from "./modules/views/FeaturedVideos";


function Videos() {
    return (
        <React.Fragment>
            <AppAppBar />
            <FeaturedVideos></FeaturedVideos>
            <AppFooter />
        </React.Fragment>
    );
}

export default Videos;
