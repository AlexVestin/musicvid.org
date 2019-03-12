import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ItemContent from './ItemContent'

import { items } from 'editor/animation/items'

class ScrollDialog extends React.Component {
  state = {
    scroll: 'paper',
  };

  render() {
    const itemTiles = items[this.props.index];


    return (
      <div>

        <Dialog
          open={this.props.open}
          scroll={this.state.scroll}
          aria-labelledby="scroll-dialog-title"
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
      </div>
    );
  }
}

export default ScrollDialog;