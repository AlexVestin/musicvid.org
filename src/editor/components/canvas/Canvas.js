import React, { PureComponent } from 'react'
import classes from './Canvas.module.scss';
import * as Stats from 'stats.js'

import Resize from './Resize';
export default class Canvas extends PureComponent {
    constructor() {
        super();
        this.state = {aspectRatio: 1920 / 1080, width: 640, height: 480, scaleFactor: 0.5, inFullscreen: false}; 
        this.height = 500;
        
        
        this.userFactor = 1; 
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

        window.onresize = () => this.setSize(this.internalResolution);
    }

    getContainerRef = () => this.containerRef.current;
    
    toggleFullscreen = (inFullscreen) => {
        this.setState({inFullscreen}, () => {
            if(!inFullscreen) {
                this.setSize(this.internalResolution);
            } else {
                this.canvasRef.current.style.transform = "";
            }
        })
    }


    userResize = (x, y) => {
        const w = this.internalResolution.width * this.internalScaleFactor;
        const h = this.internalResolution.height * this.internalScaleFactor;

        const percHeightChange = y / h;
        const percWidthChange = x / w;

        if (percHeightChange > percWidthChange) {
            this.userFactor = 1 + percHeightChange;
        } else {
            this.userFactor = 1 + percWidthChange;
        }

        if (this.userFactor < 0.75) this.userFactor = 0.75;
        if (this.userFactor > 1.45) this.userFactor = 1.45;

        this.setSize(this.internalResolution);
    }

    

    setSize = (res, userFactor = -1) => {
        const c = this.canvasRef.current; 
        let factor = (window.innerWidth * window.innerHeight) / (1.88 * Math.pow(10, 6));
        let scaleFactor = 1.0;
        
        if(res.width > 1500) {
            scaleFactor = 0.4 * factor * this.userFactor;
        }else if(res.width > 700) {
            scaleFactor = 0.6 * factor * this.userFactor;
        }


        this.internalResolution = res;
        this.internalScaleFactor = scaleFactor;
        c.style.transform = `scale(${scaleFactor})`;
        this.setState({width: res.width * scaleFactor, height: res.height * scaleFactor})
    }

    getMountRef = () => this.canvasRef.current;

    render() {
        const { width, height } = this.state;

        return (
            <div className={classes.container} ref={this.containerRef}>
                <div ref={this.canvasRef2} className={classes.canvasMount} style={{width: width, height: height}}>
                    <Resize onResize={this.userResize}></Resize>
                    <canvas className={classes.canvas}  ref={this.canvasRef} ></canvas>

                </div>
                
                

                


            </div>
        )
    }
}
