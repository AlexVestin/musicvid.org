import React from "react";
import Typography from "home/modules/components/Typography";
import Button from "home/modules/components/Button";
import { connect } from "react-redux";
import { app, base } from "backend/firebase";
import RemoveDialog from "home/RemoveDialog";
import ImageTiles from './ImageTiles'
import { setSnackbarMessage } from "../../../fredux/actions/message";


class ProjectList extends React.PureComponent {
    state = {
        loaded: false,
        projects: [],
        redirectTo: "",
        modalOpen: false,
        message: "Loading Projects...",
        error: false
    };
    getProjects = async () => {
        this.setState({ message: "Loading projects...", error: false });
        let snapshot;
        try {
            snapshot = await base
                .collection("users")
                .doc(app.auth().currentUser.uid)
                .collection("projects")
                .get();
        } catch (err) {
            this.setState({
                message: "Error ocurred while loading projects.",
                error: true
            });
            return;
        }

        this.createTileData(snapshot.docs.map(doc => doc.data()));
        this.setState({
            //projects: snapshot.docs.map(doc => doc.data()),
            loaded: true,
            error: false
        });
    };

    componentDidMount() {
        if (!this.loaded && this.props.isAuthenticated) {
            this.getProjects();
        } else if (!this.props.authFetching && !this.props.isAuthenticated) {
            this.setState({ message: "Please sign in to view your projects" });
        }
    }

    componentWillReceiveProps(props) {
        if (props.isAuthenticated && !this.state.loaded) {
            this.getProjects();
        }
    }

    handleRemove = async project => {
        const p1 = base
            .collection("users")
            .doc(app.auth().currentUser.uid)
            .collection("projects")
            .doc(project.id)
            .delete();

        const p2 = base
            .collection("projects")
            .doc(project.id)
            .delete();
        
        const p3 = base
            .collection("featured")
            .doc("all")
            .collection("projects")
            .doc(project.id)
            .delete();

        Promise.all([p1, p2, p3]).then(() => {
            const projects = [...this.state.projects].filter(
                p => p.id !== project.id
            );
            this.setState({
                projects,
                loaded: true,
                project: null,
                modalOpen: false
            });
        }).catch(err => {
            setSnackbarMessage(err.message, "error");
        });
    };

    createTileData = (projects) => {
        this.setState({projects});
    }

    handleCancel = () => {
        this.setState({ loaded: true, project: null, modalOpen: false });
    };

    removeProject = project => {
        this.setState({ modalOpen: true, projectToRemove: project });
    };

    render() {
        return (
            <React.Fragment>
                <RemoveDialog
                    project={this.state.projectToRemove}
                    open={this.state.modalOpen}
                    handleYes={this.handleRemove}
                    handleNo={this.handleCancel}
                />
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    {this.state.projects.length === 0 ? (
                        <React.Fragment>
                            {!this.state.loaded ? (
                                <div style={{ textAlign: "center" }}>
                                    <Typography
                                        style={{ color: "#efefef" }}
                                        variant="h6"
                                    >
                                        {this.state.message}
                                    </Typography>

                                    {this.state.error && (
                                        <Button
                                            color="secondary"
                                            onClick={this.getProjects}
                                        >
                                            Try again
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <Typography style={{ color: "#efefef" }} variant="h6">
                                    You don't currently have any projects! You
                                    can make a new one in the editor
                                </Typography>
                            )}
                        </React.Fragment>
                    ) : (
                        <ImageTiles

                            tileData={this.state.projects}
                            loadProject={this.props.loadProject}
                            onRemove={this.removeProject}
                        />
                    )}
                </div>
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

export default connect(mapStateToProps)(ProjectList);
