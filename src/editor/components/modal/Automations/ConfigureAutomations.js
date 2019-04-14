import React, { PureComponent } from 'react'
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import ActiveAutomations from './ActiveAutomations'

export default class AddNewAutomation extends PureComponent {
  render() {
      const {item } = this.props;
    return (
      <div>
          <DialogContentText>
              Configure automations for {item.object.name + "-" + item.property} :
            </DialogContentText>
          
            <ActiveAutomations item={item}></ActiveAutomations>  
            <Button onClick={this.props.selectAutomation}> Select automation </Button>
          

          <Button onClick={this.props.back}>Go back</Button>
      </div>
    )
  }
}
