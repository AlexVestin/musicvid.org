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
import Cloud from '@material-ui/icons/Cloud';

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

    componentDidMount() {

        this.fileRef.current.onchange = () => {
            this.props.onSelect(this.fileRef.current.files[0]);
        }
    }

    loadAudioFromFile = () => {
        this.fileRef.current.click()
    }

    loadAudioFromURL = (e) => {
        e.stopPropagation();
        this.props.onSelect(this.inputRef.current.value)
    }

    loadSampleAudio = () => {
        this.props.onSelect("sampleUrl")
    }

  handleClose = () => {
    this.props.onSelect();
  };
  
  noFile = () => {

  }

  handleListItemClick = value => {
    this.props.onSelect(value);
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
        <React.Fragment>
            <input accept="image/*" type="file" ref={this.fileRef} style={{ display: 'none' }} />
            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
                
                <DialogTitle id="simple-dialog-title">Load image</DialogTitle>
                <div>
                <List>
                <ListItem button onClick={this.loadAudioFromFile}>
                    <ListItemAvatar>
                        <Avatar>
                        <AddPhotoAlternate />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Load file from computer" />
                    </ListItem>

                    <ListItem button disabled onClick={this.loadAudioFromURL}>
                      <ListItemAvatar >
                          <Avatar>
                          <Cloud />
                          </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Use image url (disabled)" />
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


