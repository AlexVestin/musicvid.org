import React, { PureComponent } from 'react'
import { Typography } from '@material-ui/core';
import AutomationsList from './AutomationsList'
import classes from './AutomationsModal.module.scss';

const customAutomations = [
  {name: "Point Automation", description: "Keyframe like automations", type: "point"},
  {name: "Audio Reactive Automation", description: "Uses the impact analyser to automate a value", type: "audio"},
  {name: "Math Input Automation", description: "Use a formula/script to make a custom automation", type: "math"},
]

export default class AddNewAutomation extends PureComponent {

  onSelect = (automation) => {

    if(this.props.onSelect) {
      this.props.onSelect(automation);
      return;
    }

    switch(automation.type) {
      case "point":
        this.props.addPointAutomation();
        break;
      case "audio":
        this.props.addAudioAutomation();
        break;
      case "math":
        this.props.addMathAutomation();
        break;

      default:
        alert("faulty selety")
    }
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
