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
import AudioTrack from '@material-ui/icons/Audiotrack';
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

    loadSampleAudio = () => {
        this.props.onSelect("https://s3.eu-west-3.amazonaws.com/fysiklabb/Reverie.mp3")
    }

  handleClose = () => {
    this.props.onSelect();
  }; 


  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
        <React.Fragment>
            <input accept="audio/*" type="file" ref={this.fileRef} style={{ display: 'none' }} />
            <Dialog aria-labelledby="simple-dialog-title" {...other}>
                
                <DialogTitle id="simple-dialog-title">Load audio</DialogTitle>
                <div>
                <List>
                <ListItem button onClick={this.loadAudioFromFile}>
                    <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                        <AudioTrack />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Load file from computer" />
                    </ListItem>
                    <ListItem button onClick={this.loadAudioFromURL}>
                    <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                        <Cloud />
                        </Avatar>
                    </ListItemAvatar>
                      <ListItemText  onClick={this.loadSampleAudio} primary="Use sample audio file"  secondary="Reverie by Nomyn"/>
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


