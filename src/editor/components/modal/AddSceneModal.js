import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';

import blue from '@material-ui/core/colors/blue';

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
};

class SimpleDialog extends React.Component {

    constructor() {
        super();

        this.state = { expanded: false };

        this.fileRef = React.createRef();
        this.inputRef = React.createRef();
    }

  handleClose = () => {
    this.props.onSelect();
  };
  


  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
        <React.Fragment>
            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
                
                <DialogTitle id="simple-dialog-title">Add new scene</DialogTitle>
                <div>
                <List>
                <ListItem button onClick={() => this.props.onSelect("ortho")}>
                    <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                          <AddPhotoAlternate />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Add new 3D scene with Orthographic Camera (2d)" />
                    </ListItem>

                    <ListItem button  onClick={() => this.props.onSelect("perspective")}>
                      <ListItemAvatar >
                          <Avatar className={classes.avatar}>
                          <AddPhotoAlternate />
                          </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Add new 3D scene with Perspective Camera (3d)" />
                    </ListItem>

                    <ListItem button onClick={() => this.props.onSelect("canvas")}>
                      <ListItemAvatar >
                          <Avatar className={classes.avatar}>
                          <AddPhotoAlternate />
                          </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Add new 2D scene." />
                    </ListItem>
                </List>
                </div>
            </Dialog>
      </React.Fragment>
    );
  }
}

SimpleDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

export default withStyles(styles)(SimpleDialog);


