import withRoot from "./modules/withRoot";
// --- Post bootstrap -----
import React from "react";
import Typography from "./modules/components/Typography";
import LayoutBody from "./modules/components/LayoutBody";
import AppAppBar from "./modules/views/AppAppBar";
import AppFooter from "./modules/views/AppFooter";
import { connect } from "react-redux";
import { app, base } from "backend/firebase";
import ProjectList from "./ProjectList";
import { setProjectFile } from 'fredux/actions/project'
import { Redirect } from 'react-router-dom'

class Projects extends React.PureComponent {
    state = { loaded: false, projects: [], redirectTo: "" };
    async getProjects() {
        const snapshot = await base
            .collection("users")
            .doc(app.auth().currentUser.uid)
            .collection("projects")
            .get();
        this.setState({ projects: snapshot.docs.map(doc => doc.data()), loaded: true});
    }

    componentDidMount() {
        if (!this.loaded && this.props.isAuthenticated) {
            this.getProjects();
        }
    }

    componentWillReceiveProps(props) {
        if (props.isAuthenticated && !this.state.loaded) {
            this.getProjects();
        }
    }

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
                    <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    {this.state.projects.length === 0 ?
                         <React.Fragment>
                         {!this.state.loaded ?
                            <Typography variant="h6">Loading projects...</Typography>   
                            :
                            <Typography variant="h6">You don't currently have any projects! You can make a new one in the editor</Typography>   
                            }
                        </React.Fragment>
                        :
                        <ProjectList
                        projects={this.state.projects}
                        onSelect={this.loadProject}
                    />
                    }
                   
                    </div>
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

export default connect(mapStateToProps)(withRoot(Projects));
