
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
import PersonalVideo from '@material-ui/icons/PersonalVideo';
import blue from '@material-ui/core/colors/blue';
import Typography from '@material-ui/core/Typography';


const reg = [{name: "480p", res: "640x480"}, {name: "720p", res: "1280x720"},  {name: "1080p", res: "1920x1080"}, {name: "box", res: "1024x1024"}]

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
};

class SimpleDialog extends React.Component {
  handleClose = () => {
    //this.props.onClose(this.props.selectedValue);
  }; 

  getDimensions = (object) => { 
    return { width: Number(object.split("x")[0]), height: Number(object.split("x")[1]) } 
  }

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Project resolution</DialogTitle>
        <div>
          <List>
            {reg.map(email => (
              <ListItem button onClick={() => this.props.onSelect(this.getDimensions(email.res))} key={email.name}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <PersonalVideo />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="h6" style={{ textTransform: 'none' }}>{email.name}</Typography>}  secondary={email.res}/>
              </ListItem>
            ))}

          </List>
        </div>
      </Dialog>
    );
  }
}

SimpleDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

export default withStyles(styles)(SimpleDialog);


