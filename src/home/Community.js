import React from "react";

// --- Post bootstrap -----
import AppAppBar from "./modules/views/AppAppBar";
import AppFooter from "./modules/views/AppFooter";
import CommunityProjects from "./modules/views/CommunityProjects";

class Community extends React.PureComponent {


    render() {
        return (
            <React.Fragment>
                <AppAppBar />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <CommunityProjects />
                </div>
                <AppFooter />
            </React.Fragment>
        );
    }
}


export default (Community);
