import React, { PureComponent } from 'react'
import classes from './Slider.module.scss';

export default class Slider extends PureComponent {
  state = { value: 0 }
  onChange = (e) => {
    if(this.props.disabled) {
      e.stopPropagation();
      return;
    }
    this.props.audio.setVolume(e.target.value /  100);
    this.setState({value: e.target.value});
  }
  render() {
    return (
      <input value={this.state.value} onChange={this.onChange} style={this.props.style} type="range" className={classes.slider}></input>
    )
  }
}
