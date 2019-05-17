import withRoot from "./modules/withRoot";
// --- Post bootstrap -----
import React from "react";
import Typography from "./modules/components/Typography";
import LayoutBody from "./modules/components/LayoutBody";
import AppAppBar from "./modules/views/AppAppBar";
import AppFooter from "./modules/views/AppFooter";
import { connect } from "react-redux";
import { setProjectFile } from 'fredux/actions/project'
import { Redirect } from 'react-router-dom'
import ProjectList from "./ProjectList";
import { Switch, Route } from 'react-router-dom'




class Projects extends React.PureComponent {
    state = {redirectTo: ""}

    loadProject = (project) => {
        setProjectFile(project);
        this.setState({redirectTo: `editor?project=${project.id}`})
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
                        Projects
                    </Typography>
                    <ProjectList loadProject={this.loadProject}></ProjectList>
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

const withStuff = connect(mapStateToProps)(withRoot(Projects));

class ProjectRouter extends React.PureComponent {

    render() {
        return(
            <Switch>
                <Route exact path="/projects" component={withStuff}></Route>
            </Switch>
        )
    }
}


export default ProjectRouter;
