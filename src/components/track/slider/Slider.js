import React, { PureComponent } from 'react'
import classes from './Slider.module.scss';

export default class Slider extends PureComponent {
  render() {
    return (
      <input style={this.props.style} type="range" className={classes.slider}></input>
    )
  }
}
