import React, { PureComponent } from 'react'
import classes from './SelectResolutionModal.module.scss';

export default class ItemsModal extends PureComponent {

    state = {selected: ""}

    setSelected = (name) => {this.setState({selected:name})}
  render() {
    return (
      <React.Fragment>
          <div className={classes.title}>
            Choose resolution
        </div>

        <div className={classes.resolutionBoxContainer}>
            <div>HELLO</div>
            <button onClick={() => this.props.onSelect("Bars")}>Bars</button>
            <button onClick={() => this.props.onSelect("JSNation")}>JSNation</button>
            <button onClick={() => this.props.onSelect("Plane")}>Plane</button>

        </div>

      </React.Fragment>
    )
  }
}
