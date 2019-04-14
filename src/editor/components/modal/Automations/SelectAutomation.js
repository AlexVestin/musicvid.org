import React, { PureComponent } from 'react'
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';

import AutomationsList from './AutomationsList'

export default class SelectAutomation extends PureComponent {
  render() {
      const { gui } = this.props;
    return (
      <div>
          <DialogContentText>
              Select an automation :
            </DialogContentText>    

            <AutomationsList onSelect={this.props.onSelect} automations={gui.__automations}></AutomationsList>
       

          <Button onClick={this.props.addNewAutomation}>Add new automation</Button>
          <Button onClick={this.props.back}>Go back</Button>
      </div>
    )
  }
}
