import React, { PureComponent } from 'react'
import classes from './SelectResolutionModal.module.scss';
import ResolutionBox from './ResolutionBox'

const reg = [{name: "480p", res: "640x480"}, {name: "720p", res: "1280x720"},  {name: "1080p", res: "1920x1080"}]
const insta = [{name: "box", res: "1024x1024"}]
export default class Resolution extends PureComponent {

    state = {selected: ""}

    setSelected = (name) => {this.setState({selected:name})}
  render() {
    return (
      <React.Fragment>
          <div className={classes.title}>
            Choose resolution
        </div>

        <div className={classes.resolutionBoxContainer}>
            <ResolutionBox selected={this.state.selected} onClick={this.props.onSelect} title="Regular" items={reg}></ResolutionBox>
            <ResolutionBox selected={this.state.selected} onClick={this.props.onSelect} title="Instagram" items={insta}></ResolutionBox>
        </div>

      </React.Fragment>
    )
  }
}
