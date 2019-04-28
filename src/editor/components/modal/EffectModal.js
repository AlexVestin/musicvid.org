import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ItemContent from './ItemContent'
import { withStyles } from '@material-ui/core/styles';

import { passes } from 'editor/animation/postprocessing/passes'



const styles = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
});

class ScrollDialog extends React.Component {
  state = {
    scroll: 'paper',
  };

  render() {
    const itemTiles = passes;

    return (

        <Dialog
          open={this.props.open}
          aria-labelledby="max-width-dialog-title"
          fullWidth={true}
          maxWidth="lg"
        >
          <DialogTitle id="scroll-dialog-title">Add Item</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Add item to project:
            </DialogContentText>
          <ItemContent tiles={itemTiles} onSelect={this.props.onSelect}></ItemContent>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.onSelect()} color="primary">
              Cancel
            </Button>

          </DialogActions>
        </Dialog>
    );
  }
}
export default withStyles(styles)(ScrollDialog);

