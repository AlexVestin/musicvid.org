import React, { PureComponent } from 'react'
import { Typography } from '@material-ui/core';
import AutomationsList from './AutomationsList'
import classes from './AutomationsModal.module.scss';

const customAutomations = [
  {name: "Point Automation", description: "Keyframe like automations", type: "point"},
  {name: "Audio Reactive Automation", description: "Uses the impact analyser to automate a value", type: "audio"},
  {name: "Math Input Automation", description: "Use a formula/script to make a custom automation", type: "math"},
  {name: "Shake Automation", description: "Triggers random values, useful for shake animations", type: "shake"},
]

export default class AddNewAutomation extends PureComponent {

  onSelect = (automation) => {

    if(this.props.onSelect) {
      this.props.onSelect(automation);
      return;
    }
    
    this.props.addAutomation(automation.type);
  }

  render() {
    return (
      <div className={classes.container}>
      <div >
          <Typography variant="h6">
              Add new automation
          </Typography>

          <Typography variant="h5">
              Custom automations
          </Typography>

          <AutomationsList onSelect={this.onSelect} automations={customAutomations}></AutomationsList>
      </div>
      </div>
    )
  }
}
