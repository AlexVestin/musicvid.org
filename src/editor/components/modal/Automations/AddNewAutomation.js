import React, { PureComponent } from 'react'
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

export default class AddNewAutomation extends PureComponent {


  addMathAutomation = () => {
    this.props.addMathAutomation();
  }

  render() {
    return (
      <div>
          <Typography variant="h4">
              Add new automation
          </Typography>

          <Typography variant="h6">
              Custom automations
          </Typography>
          <div style={{display:"flex", justifyContent:"row"}}> 
            <Button onClick={this.addTimedAutomation}>Add timed automations</Button>
            <Button onClick={this.props.addAudioAutomation}>Add audio reactive automation</Button>
            <Button onClick={this.addMathAutomation}>Add user input automation </Button>
          </div>

          <Typography variant="h6">
              Preset automations
          </Typography>

          <div style={{display:"flex", justifyContent:"row"}}> 
            <Button>Add timed automations</Button>
            <Button>Add audio reactive automation</Button>
            <Button>Add user input automation </Button>
          </div>

          <Button onClick={this.props.back}>Go back</Button>
      </div>
    )
  }
}
