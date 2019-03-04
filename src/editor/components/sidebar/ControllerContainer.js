import React, { PureComponent } from 'react'

import classes from './ControllerContainer.module.scss'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

class GUIMount extends PureComponent {
    constructor() {
        super();

        this.mountRef = React.createRef();
    }

    componentDidMount() {
        this.mountRef.current.appendChild(this.props.gui);
    }

    render() {
        return (
            <div ref={this.mountRef}></div>
        )
    }
}

export default class ControllerContainer extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {index: 0};
    }

    componentDidMount() {
        this.initExportGUI();
    }

    initExportGUI = () => {
        const folder = this.props.gui.__folders["Export"];
        

        this.MBitBitrate = 7.2;
        this.fps = 60;
        this.preset =  "fast";
        this.presetLookup = [
            "ultrafast",
            "veryfast",
            "fast",
            "medium",
            "slow",
            "veryslow"
        ];
        this.fileName = "myvid.mp4";
        folder.add(this, "fileName");
        const advFolder = folder.addFolder("Advanced settings");
        advFolder.add(this, "fps", [24, 25, 30, 48, 60]);
        advFolder.add(this, "preset", this.presetLookup)
        advFolder.add(this, "MBitBitrate", 0, 20, 0.1);
        folder.add(this, "startEncoding");
    }

    startEncoding = () => {
        const { checkLicense, disabled, startEncoding } = this.props;
        if(!disabled) {
            checkLicense().then(() => {
                const bitrate = this.MBitBitrate * Math.pow(10, 6);
                const preset = this.presetLookup.findIndex(e => e === this.preset);
                startEncoding({fps: this.fps, bitrate: bitrate, preset: preset, fileName: this.fileName})
            });
           
        }
       
    }

    render() {
        const { index } = this.state;
        const { gui, loaded } = this.props;

        const selectedColor = "#444";
        return (
            <div className={classes.container} >
                <div className={classes.wrapper}>
                    <div className={classes.headerButtons}>
                        <div onClick={()=>this.setState({index: 0})} style={{backgroundColor: index === 0 ? selectedColor : ""}}>overview</div>
                        <div onClick={()=>this.setState({index: 1})} style={{backgroundColor: index === 1 ? selectedColor : ""}}>layers</div>
                        <div onClick={()=>this.setState({index: 2})} style={{backgroundColor: index === 2 ? selectedColor : ""}}>audio</div>
                        <div onClick={()=>this.setState({index: 3})} style={{backgroundColor: index === 3 ? selectedColor : ""}}>settings</div>
                        <div onClick={()=>this.setState({index: 4})} style={{backgroundColor: index === 4 ? selectedColor : ""}}>export</div>
                    </div>
                    <div style={{width: "100%", height: 5, backgroundColor: "gray"}}></div>
                    <SimpleBar data-simplebar-force-visible style={{ width: "100%", height: "95%", borderBottom: "2px solid gray", borderLeft: "2px solid gray", borderRight: "2px solid gray" }}>
                        {index === 0 && loaded && <GUIMount gui={gui.__folders["Overview"].domElement}></GUIMount>}
                        {index === 1 && loaded && <GUIMount gui={gui.__folders["Layers"].domElement}></GUIMount>}
                        {index === 2 && loaded && <GUIMount gui={gui.__folders["Audio"].domElement}></GUIMount>}
                        {index === 3 && loaded && <GUIMount gui={gui.__folders["Settings"].domElement}></GUIMount>}
                        {index === 4 && loaded && <GUIMount gui={gui.__folders["Export"].domElement}></GUIMount>}
                    </SimpleBar>
                </div>
            </div>
        )
    }
}
