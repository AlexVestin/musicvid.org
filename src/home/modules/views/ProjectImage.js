import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";

import Typography from "../components/Typography";
import styles from "./GridStyles";
import { base, storage } from "backend/firebase";
import { Redirect } from "react-router-dom";

class Image extends PureComponent {
    constructor() {
        super();

        this.videoRef = React.createRef();
        this.videoMountRef = React.createRef();

        this.state = {
            mouseOver: false,
            title: "",
            userName: "user",
            img: "",
            loaded: false,
            fetched: false
        };
    }

    componentDidMount = async () => {
        const { id } = this.props.project;
        const project = await this.loadProject(id);
        let url = "img/256placeholder.png";
        let img = await storage
            .ref()
            .child(id)
            .getDownloadURL()
            .catch(err => {
                this.setState({
                    title: project.data().name,
                    img: url,
                    fetched: true,
                    project: project.data()
                });
            });
        this.setState({ project: project.data(), title: project.data().name, img: img, fetched: true });
    };

    loadMoreInfo = event => {
        event.preventDefault();
        event.stopPropagation();

        this.props.editProject(this.state.project, this.state.img);
    };

    async loadProject(uid) {
        return await base
            .collection("projects")
            .doc(uid)
            .get();
    }

    render() {
        const { project, classes } = this.props;


        return (
            <ButtonBase
                className={classes.imageWrapper}
                style={{
                    width: "33%",
                    minWidth: 370,
                    height: "100%",
                    backgroundColor: "#000"
                }}
                id={this.state.title}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {(!this.state.fetched) && (
                        <Typography variant="h1">{"Loading..."}</Typography>
                    )}
                    {this.state.img && (
                        <img
                            onLoad={() => this.setState({ loaded: true })}
                            src={this.state.img}
                            alt="sfg"
                            style={{ width: "100%", height: "auto" }}
                        />
                    )}
                </div>

                <div className={classes.imageBackdrop} />

                <div
                    onMouseOver={this.play}
                    onMouseOut={this.pause}
                    className={classes.imageButton}
                    id={project.id}
                    onClick={this.props.loadProject}
                >
                    <Typography
                        component="h3"
                        variant="h6"
                        color="inherit"
                        className={classes.imageTitle}
                        style={{ pointerEvents: "none" }}
                    >
                        {this.state.title}
                        <div className={classes.imageMarked} />
                    </Typography>

                    <div
                        className={classes.attrib}
                        style={{ pointerEvents: "inherit" }}
                    >
                        <div
                            style={{
                                backgroundColor: "rgba(255,255,255,0.17)",
                                padding: 4,
                                zIndex: 10000
                            }}
                            onClick={this.loadMoreInfo}
                        >
                            <Typography
                                component="h6"
                                variant="h6"
                                color="inherit"
                            >
                                More info
                            </Typography>
                        </div>
                    </div>
                </div>
            </ButtonBase>
        );
    }
}

export default withStyles(styles)(Image);
