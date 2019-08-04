import React, { PureComponent } from 'react'
import classes from './Canvas.module.scss';

export default class Resize extends PureComponent {

    componentDidMount() {
        document.onmouseup = this.mouseUp;
        document.onmousemove = this.mouseMove;

        

    }
    mouseDown = (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
      this.mouseIsDown = true;

      if (!this.initialPosition) {
        this.initialPosition = {x: this.x, y: this.y};
      }
    }

    mouseMove = (e) => {
        if (this.mouseIsDown) {
            let x = this.initialPosition.x - e.clientX;
            let y = -(this.initialPosition.y - e.clientY);
            this.props.onResize(x,y);
        }
    }

    mouseUp = (e) => {

        if (this.mouseIsDown) {
            this.mouseIsDown = false;

            let x = this.initialPosition.x - e.clientX;
            let y = -(this.initialPosition.y - e.clientY);
            this.props.onResize(x, y);
        }
        
    }

    render() {
        return (
            <div onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} className={classes.resize}></div>
        )
    }
}
