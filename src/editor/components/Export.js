import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import WhileExporting from "./WhileExporting";
import DoneExporting from "./DoneExporting";
import CancelExportModal from './modal/CancelExportModal';
import blue from "@material-ui/core/colors/blue";
import ExportCard from "./ExportCard";
import Button from "@material-ui/core/Button";
import Questionaire from './Questionairre';


const audioItem =  {
    name: "Nomyn - Reverie",
    imageUrl: "img/items/reverie.jpg",
    projectUrl: "https://nomyn.bandcamp.com/track/reverie",
    authors: [ {
        name: "Nomyn",
        social1: {type: "soundcloud", url: "https://soundcloud.com/nomyn"},
        social2: {type: "twitter", url: "https://twitter.com/nomynmusic"},
    }]   
};


const styles = {
    root: {
        marginTop: 30,
        width: "50%"
    },
    cotntainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        backgroundColor: blue[100],
        color: blue[600]
    }
};

class SimpleDialog extends React.Component {
    state = {modalOpen: false, questionaireOpen: true };
    componentDidMount() {
        this.startTime = performance.now();
        window.onbeforeunload = function(event) {
            // do stuff here
            event.returnValue =
                "Your export will be canceled, are you sure you want navigate away?";
            return "Your export will be canceled, are you sure you want navigate away?";
        };
    }

    handleClose = () => {
        //this.props.onClose(this.props.selectedValue);
    };

    getDimensions = object => {
        return {
            width: Number(object.split("x")[0]),
            height: Number(object.split("x")[1])
        };
    };

    toggleModal = () => { 
        if(!this.props.encoding) {
            this.setState({modalOpen: !this.state.modalOpen});
        }else {
            if (window.__cancel) {
                window.__cancel();
            }
            this.props.cancel();
           
        }
    } 

    cancel = () => {
        this.props.cancel();
        this.toggleModal();
    }

    render() {
        const { classes, progress, encoding, fileName, blobFile, usingSampleAudio } = this.props;
        const items = this.props.items;
        const dt = (performance.now() - this.startTime) / 1000;
        //  Very cool scientific constant that predicts export time
        let timeLeft = (1.55*dt / progress) - dt* (1 + Math.pow(progress, 3));
        if(timeLeft < 0) timeLeft = 0;

        return (
            <div className={classes.container}>
             <CancelExportModal open={this.state.modalOpen} accept={this.cancel} reject={this.toggleModal}></CancelExportModal>
             <Questionaire close={() => this.setState({questionaireOpen: false})} open={this.state.questionaireOpen}></Questionaire>
                <List>
                     <ListItem style={{ justifyContent: "center" }}>
                        <Typography
                            style={{ color: "#efefef" }}
                            component="h4"
                            variant="h4"
                        >
                            <Button  style={{color: !encoding ? '#ff3366' : '#12FF12'}} onClick={this.toggleModal}>Go back to project {!encoding ? "(and cancel encoding)" : "" }</Button>
                        </Typography>
                    </ListItem>

                    {encoding ? (
                        <DoneExporting fileBlob={blobFile} fileName={fileName} classes={classes} />
                    ) : (
                        <WhileExporting timeLeft={timeLeft} classes={classes} progress={progress} />
                    )}

                    <ListItem style={{ justifyContent: "center" }}>
                        <Typography
                            style={{ color: "#efefef" }}
                            component="h4"
                            variant="h4"
                        >
                            Creators
                        </Typography>
                    </ListItem>

                    {usingSampleAudio && <ListItem style={{ justifyContent: "center" }}>
                        <ExportCard item={audioItem} />
                    </ListItem>}

                    {items.map(item => {
                        if (item.showAttribution) {
                            return (
                                <ListItem
                                    key={item.name}
                                    style={{ justifyContent: "center" }}
                                >
                                    <ExportCard item={item} />
                                </ListItem>
                            );
                        }
                        return null;
                    })}

                    <ListItem style={{ justifyContent: "center" }}>
                        <Typography
                            style={{ color: "#efefef" }}
                            component="h6"
                            variant="h6"
                        >
                            musicvid.org Socials
                        </Typography>
                    </ListItem>

                    <ListItem style={{ justifyContent: "center" }}>
                        <Typography variant="h5" color="secondary">
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{
                                        backgroundColor: "#7289DA",
                                        width: 200
                                    }}
                                    className={classes.button}
                                    href="https://discord.gg/Qf7y579"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Discord
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{
                                        backgroundColor: "#ff0000",
                                        width: 200,
                                        color: "#efefef",
                                        marginTop: 12
                                    }}
                                    className={classes.button}
                                    href="https://www.youtube.com/channel/UCMujRUizB4Rwdt_c0hpYryA"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    youtube
                                </Button>
                            </div>
                        </Typography>
                    </ListItem>
                </List>
            </div>
        );
    }
}

SimpleDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string
};

export default withStyles(styles)(SimpleDialog);
