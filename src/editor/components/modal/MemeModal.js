import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";

import blue from "@material-ui/core/colors/blue";

const styles = {
    avatar: {
        backgroundColor: blue[100],
        color: blue[600]
    }
};

class ProjectFile extends React.Component {
    constructor() {
        super();

        this.state = { expanded: false };

        this.fileRef = React.createRef();
    }

    componentDidMount() {
        this.fileRef.current.onchange = () => {
            this.props.onSelect(this.fileRef.current.files);
        };
    }

    loadFromFile = () => {
        this.fileRef.current.click();
    };


    handleClose = () => {
        this.props.onSelect();
    };

    noFile = () => {};

    handleListItemClick = value => {
        this.props.onSelect(value);
    };

    render() {
        const { classes, onClose, selectedValue, ...other } = this.props;

        return (
            <React.Fragment>
                <input
                    accept="image/*"
                    type="file"
                    ref={this.fileRef}
                    style={{ display: "none" }}
                    multiple
                />
                <Dialog
                    onClose={this.handleClose}
                    aria-labelledby="simple-dialog-title"
                    {...other}
                >
                    <DialogTitle id="simple-dialog-title">
                        Load images
                    </DialogTitle>
                    <div>
                        <List>
                            <ListItem button onClick={this.loadFromFile}>
                                <ListItemAvatar>
                                    <Avatar className={classes.avatar}>
                                        <AddPhotoAlternate />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Load images from computer" />
                            </ListItem>
                        </List>
                    </div>
                </Dialog>
            </React.Fragment>
        );
    }
}

ProjectFile.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string
};

export default withStyles(styles)(ProjectFile);
