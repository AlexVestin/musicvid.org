// --- Post bootstrap -----
import React from "react";
import Typography from "./modules/components/Typography";
import LayoutBody from "./modules/components/LayoutBody";
import AppAppBar from "./modules/views/AppAppBar";
import AppFooter from "./modules/views/AppFooter";
import Link from "@material-ui/core/Link";


function Missing() {
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
                    Page not found
                </Typography>

                <Typography 
                    variant="h6"
                    align="center"
                    
                    color="secondary"
                    >
                    
                    <Link href="/" style={{color: "#1111cc", textDecoration: "underline"}}>
                        Go back to main page
                    </Link>

                </Typography>
               
            </LayoutBody>
            <AppFooter />
        </React.Fragment>
    );
}

export default Missing;
