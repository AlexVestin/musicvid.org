import React, { PureComponent } from 'react'
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import AutomationsList from './AutomationsList'
import classes from './AutomationsModal.module.scss';




const customAutomations = [
  {name: "Point Automation", description: "Keyframe like automations", type: "point"},
  {name: "Audio Reactive Automation", description: "Uses the impact analyser to automate a value", type: "audio"},
  {name: "Math Input Automation", description: "Use a formula/script to make a custom automation", type: "math"},
  {name: "Modulation Automation", description: "Modulate a value using bpm and sine waves", type: "modulation"},
]

export default class AddNewAutomation extends PureComponent {


  addMathAutomation = () => {
    this.props.addMathAutomation();
  }

  onSelect = (automation) => {
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
      case "modulation":
        this.props.addModulationAutomation();
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

          <Typography variant="h8">
              Custom automations
          </Typography>

          <AutomationsList onSelect={this.onSelect} automations={customAutomations}></AutomationsList>
      </div>
      </div>
    )
  }
}
