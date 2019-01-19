import React, { PureComponent } from 'react'
import classes from './Canvas.module.scss';
import * as Stats from 'stats.js'

export default class Canvas extends PureComponent {
    constructor() {
        super();
        this.state = {aspectRatio: 1920 / 1080, width: 640, height: 480}; 
        this.height = 500;
        
        
        this.stats = new Stats();
        this.stats.showPanel( 0 );
        this.canvasRef = React.createRef();
        this.canvasRef2 = React.createRef();
        
        this.containerRef = React.createRef();
    }
    begin = () => this.stats.begin();
    end = () => this.stats.end();

    componentDidMount() {
        this.canvasRef2.current.appendChild(this.stats.dom);
        this.stats.dom.style.position = "absolute";
        this.stats.dom.style.zIndex = "0";

    }

    setSize = (res) => {
        this.aspectRatio = res.width / res.height;
        this.setState({width: this.height * this.aspectRatio, height: this.height})
        this.canvasRef.current.width = this.height * this.aspectRatio;
        this.canvasRef.current.height = this.height;
    }

    getMountRef = () => this.canvasRef.current;

    render() {
        const { width, height } = this.state;
        return (
            <div className={classes.container} ref={this.containerRef}>
                <div ref={this.canvasRef2} className={classes.canvasMount} style={{ width, height}}>
                    <canvas className={classes.canvas}  ref={this.canvasRef} ></canvas>
                </div>
            </div>
        )
    }
}
