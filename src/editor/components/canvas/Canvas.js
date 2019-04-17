import React, { PureComponent } from 'react'
import classes from './Canvas.module.scss';
import * as Stats from 'stats.js'

export default class Canvas extends PureComponent {
    constructor() {
        super();
        this.state = {aspectRatio: 1920 / 1080, width: 640, height: 480, scaleFactor: 0.5}; 
        this.height = 500;
        
        
        this.stats = new Stats();
        this.stats.showPanel( 0 );
        this.canvasRef = React.createRef();
        this.canvasRef2 = React.createRef();
        
        this.containerRef = React.createRef();
    }
    begin = () => this.stats.begin();
    end = () => this.stats.end();
    hideStats = (hide) =>  {
        if(hide)
            this.stats.dom.style.display = "none";
        else 
            this.stats.dom.style.display = "inherit";
    }

    componentDidMount() {
        this.canvasRef2.current.appendChild(this.stats.dom);
        this.stats.dom.style.position = "absolute";
        this.stats.dom.style.zIndex = "0";
        this.stats.dom.style.display = "none";

    }

    setSize = (res) => {
        const c = this.canvasRef.current; 
        this.aspectRatio = res.width / res.height;
        

        console.log(res.width)
        let scaleFactor = 1.0;
        if(res.width > 1500) {
            scaleFactor = 0.4;
        }else if(res.width > 700) {
            scaleFactor = 0.6;
        }

        c.style.transform = `scale(${scaleFactor})`;

        


        this.setState({width: res.width * scaleFactor, height: res.height * scaleFactor})
    }

    getMountRef = () => this.canvasRef.current;

    render() {
        const { width, height } = this.state;

        return (
            <div className={classes.container} ref={this.containerRef}>
                <div ref={this.canvasRef2} className={classes.canvasMount} style={{width: width, height: height}}>
                    <canvas className={classes.canvas}  ref={this.canvasRef} ></canvas>
                </div>
            </div>
        )
    }
}
