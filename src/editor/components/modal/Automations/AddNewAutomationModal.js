import React, { PureComponent } from 'react'
import { Dialog } from '@material-ui/core';
import AddNewAutomation from './AddNewAutomation'


export default class AddNewAutomationModal extends PureComponent {
  render() {

    return (
        <Dialog onClose={() => this.props.onSelect()} open={this.props.open}>
          <AddNewAutomation  onSelect={this.props.onSelect}></AddNewAutomation>
        </Dialog>
    )
  }
}
