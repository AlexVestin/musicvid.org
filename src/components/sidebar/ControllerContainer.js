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
        this.bitrate = 12000 * 1000;
        this.fps = 60;
        this.preset =  6;
        folder.add(this, "bitrate");
        folder.add(this, "fps");
        folder.add(this, "preset", [1,2,3,4,5,6])
        folder.add(this, "startEncoding");
    }

    startEncoding = () => {
        this.props.startEncoding({fps: this.fps, bitrate: this.bitrate, preset: this.preset})
    }

    render() {
        const { index } = this.state;
        const { gui, loaded } = this.props;

        return (
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <div className={classes.headerButtons}>
                        <div onClick={()=>this.setState({index: 0})} style={{backgroundColor: index === 0 ? "green" : ""}}>overview</div>
                        <div onClick={()=>this.setState({index: 1})} style={{backgroundColor: index === 1 ? "green" : ""}}>layers</div>
                        <div onClick={()=>this.setState({index: 2})} style={{backgroundColor: index === 2 ? "green" : ""}}>audio</div>
                        <div onClick={()=>this.setState({index: 3})} style={{backgroundColor: index === 3 ? "green" : ""}}>settings</div>
                        <div onClick={()=>this.setState({index: 4})} style={{backgroundColor: index === 4 ? "green" : ""}}>export</div>
                    </div>
                    <div style={{width: "100%", height: 5, backgroundColor: "gray"}}></div>
                    <SimpleBar data-simplebar-force-visible style={{ width: "100%", height: "100%" }}>
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
