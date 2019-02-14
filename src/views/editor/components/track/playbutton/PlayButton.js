import React, { PureComponent } from 'react'
import classes from './PlayButton.module.scss';

export default class PlayButton extends PureComponent {

  onClick = (e) => {
    if(!this.props.disabled)
      this.props.onClick(e)
  }
  render() {
    return (
        <img onClick={this.onClick} className={classes.img} src={this.props.img} alt="df"></img>
    )
  }
}
