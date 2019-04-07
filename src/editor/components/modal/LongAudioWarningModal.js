import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class AlertDialog extends React.Component {

  handleClose = () => {
    this.props.onSelect();
  };

  render() {
    return (

        <Dialog
          open={this.props.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Warning: Long audio import"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
                This site is in its current state more suited for exporting using shorter audio files. 
                Doing longer exports (8mins+) is possible, but due to limitations of the browser (or your computer) 
                the export might crash. 
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Understood
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

export default AlertDialog;