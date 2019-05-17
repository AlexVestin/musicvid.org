import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LayoutBody from "../components/LayoutBody";
import Typography from "../components/Typography";
import Button from "../components/Button";

import ProjectImage from "./ProjectImage";
import { connect } from "react-redux";
import { app, base } from "backend/firebase";
import { Redirect } from "react-router-dom";

const styles = theme => ({
    root: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(4),
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
    },
    images: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexWrap: "wrap"
    }
});

class CommunityProjects extends React.PureComponent {
    state = {
        open: false,
        item: null
    };

    state = {
        loaded: false,
        projects: [],
        redirectTo: "",
        modalOpen: false,
        message: "Loading Projects..."
    };
    async getProjects() {
        const snapshot = await base
            .collection("featured")
            .doc("all")
            .collection("projects")
            .get();

        this.setState({
            projects: snapshot.docs.map(doc => doc.data()),
            loaded: true
        });
    }

    addProject = () => {
        this.setState({ redirectTo: "add-project" });
    };

    componentDidMount() {
        if (!this.state.loaded) {
            this.getProjects();
        }
    }

    loadProject =(id) => {
        this.setState({redirectTo: '/editor?project='+id});
    }

    componentWillReceiveProps(props) {
        if (!this.state.loaded) {
            this.getProjects();
        }
    }

    handleCancel = () => {
        this.setState({ loaded: true, project: null, modalOpen: false });
    };

    render() {
        const { classes } = this.props;

        if (this.state.redirectTo)
            return <Redirect to={this.state.redirectTo} />;

        return (
            <React.Fragment>
                <LayoutBody
                    className={classes.root}
                    component="section"
                    width="large"
                >
                    <Typography
                        variant="h4"
                        marked="center"
                        align="center"
                        component="h2"
                    >
                        Community projects
                    </Typography>

                    <Button onClick={this.addProject}>Add your project!</Button>
                    <div className={classes.images}>
                        {this.state.projects.map(project => (
                            <ProjectImage
                                project={project}
                                loadProject={() => this.loadProject(project.id)}
                                editProject={this.props.editProject}
                                key={project.id}
                            />
                        ))}
                    </div>
                </LayoutBody>
            </React.Fragment>
        );
    }
}

CommunityProjects.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        authFetching: state.auth.fetching
    };
};

export default connect(mapStateToProps)(withStyles(styles)(CommunityProjects));
