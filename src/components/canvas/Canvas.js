import React, { PureComponent } from 'react'
import classes from './Canvas.module.css';

export default class Canvas extends PureComponent {
    constructor() {
        super();

        this.height = 500;
        this.aspectRatio = 1920 / 1080;
        this.canvasRef = React.createRef();

    }

    setSize = (res) => {
        this.aspectRatio = res.width / res.height;
        this.canvasRef.current.width = this.height * this.aspectRatio;
        this.canvasRef.current.height = this.height;
    }

    getMountRef = () => this.canvasRef.current;

    render() {
        return (
            <div className={classes.container}>
                <canvas style={{ width: this.height * this.aspectRatio, height: this.height }} className={classes.canvasMount} ref={this.canvasRef} ></canvas>
            </div>
        )
    }
}
