import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "../components/Typography";
import styles from './GridStyles'
import { base, storage } from 'backend/firebase'


class Image extends PureComponent {
    constructor() {
        super();

        this.videoRef = React.createRef();
        this.videoMountRef = React.createRef();

        this.state = { mouseOver: false, title: "", userName: "user", img: "" };
    }

    componentDidMount = async () => {
        const { id } = this.props.project;
        const project = await this.loadProject(id);
        const img = await storage.ref().child(id).getDownloadURL();
        this.setState({title: project.data().name, img: img});
    };

    async loadProject(uid){
        return await base.collection("projects").doc(uid).get();
    }


    render() {
        const { project, classes } = this.props;

        return (
            <ButtonBase
                className={classes.imageWrapper}
                onClick={this.props.loadProject}
                style={{
                    width: "33%",
                    minWidth: "33%",
                    height: "100%",
                    backgroundColor: "#333"
                }}
                id={this.state.title}
            >
                  <img 
                        src={this.state.img}
                        alt="project"
                        style={{width: "100%", height: "auto"}}
                />
             

                <div className={classes.imageBackdrop} />
                
                <div
                    onMouseOver={this.play}
                    onMouseOut={this.pause}
                    className={classes.imageButton}
                    id={project.id}
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

                    <div className={classes.attrib}>
                        <Typography component="h6" variant="h6" color="inherit">
                            {this.state.title}
                        </Typography>
                        
                    </div>
                </div>
            </ButtonBase>
        );
    }
}

export default withStyles(styles)(Image);
