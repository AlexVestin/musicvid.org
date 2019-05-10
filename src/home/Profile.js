import withRoot from "./modules/withRoot";
// --- Post bootstrap -----
import React from "react";
import Typography from "./modules/components/Typography";
import LayoutBody from "./modules/components/LayoutBody";
import AppAppBar from "./modules/views/AppAppBar";
import AppFooter from "./modules/views/AppFooter";
import Button from "./modules/components/Button";
import Redirect from "react-router-dom/Redirect";



class Profile extends React.PureComponent {
    state = {redirectTo: ""};

    render() {
        const {redirectTo} = this.state;
        if(redirectTo)
            return <Redirect to={redirectTo}></Redirect>

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
                        Profile
                    </Typography>
    
                    <Button
                        color="secondary"
                        variant="contained"
                        size="large"
                        style={{ textAlign: "center", marginTop: 10, width: 255 }}
                        onClick={() => this.setState({redirectTo: "/sign-out"})}
                    >
                        Sign out
                    </Button>
                </LayoutBody>
                <AppFooter />
            </React.Fragment>
        );  
    }
   
}

export default withRoot(Profile);
