import withRoot from "./modules/withRoot";
// --- Post bootstrap -----
import React from "react";
import Typography from "./modules/components/Typography";
import LayoutBody from "./modules/components/LayoutBody";
import AppAppBar from "./modules/views/AppAppBar";
import AppFooter from "./modules/views/AppFooter";
import { connect } from "react-redux";
import { base } from 'backend/firebase'
import { Redirect } from 'react-router-dom'
import ProjectList from "./ProjectList";


class AddProject extends React.PureComponent {
    state = {redirectTo: ""}

    loadProject = async (project)  => {
        base.collection("featured")
            .doc("all")
            .collection("projects")
            .doc(project.id)
            .set({id: project.id})
            .then((resolve, reject) =>{
                console.log(":(", resolve, reject)
                if(resolve) {
                    this.setState({redirectTo: "projects"})
                }else {
                    console.log("?")
                }
            });

            
        
    }

    render() {
        if( (this.state.redirectTo || !this.props.isAuthenticated) && !this.props.authFetching)
            return <Redirect to={this.state.redirectTo}></Redirect>

        return (
            <React.Fragment>
                <AppAppBar />
                <LayoutBody margin marginBottom style={{height: "70%"}}>
                    <Typography
                        variant="h3"
                        gutterBottom
                        marked="center"
                        align="center"
                    >
                        Add Project To Featured
                    </Typography>
                    <ProjectList hideRemoveAction={true} color={"dark"} loadProject={this.loadProject}></ProjectList>
                </LayoutBody>
                <AppFooter />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        authFetching: state.auth.fetching
    };
};

export default connect(mapStateToProps)(withRoot(AddProject));
