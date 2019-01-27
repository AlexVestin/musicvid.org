import React, { PureComponent } from 'react'
import Layers from './Layers'
import MasterSettings from './MasterSettings'
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

    constructor() {
        super();

        this.state = {index: 0};

        this.mountOverviewRef   = React.createRef();
        this.mountAudioRef      = React.createRef();
        this.mountExportRef     = React.createRef();
        this.mountLayersRef     = React.createRef();
        this.mountSettingsRef   = React.createRef();

        this.itemsCount = 0;
    }

    addLayer = () => {
        this.itemCount++;
    }

    exportVideo = () => {
        console.log("export");
    }

    onChange = (value) => {
        console.log(value);
    }

    componentDidMount() {
        const { gui } = this.props;
        this.layersFolder       = gui.addFolder("Layers", false);
        this.overviewFolder     = gui.addFolder("Overview", false);
        this.audioFolder        = gui.addFolder("Audio", false);
        this.settingsFolder     = gui.addFolder("Settings", false);
        this.exportFolder       = gui.addFolder("Export", false);       
    }

    render() {
        const { index } = this.state;
        const { gui } = this.props;

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
                        {index === 0 && gui.__folders["Overview"] && <div gui={gui.__folders["Overview"].domElement}></div>}
                        {index === 1 && gui && <GUIMount gui={gui.__folders["Layers"].domElement}></GUIMount>}
                        {index === 2 && gui && <GUIMount gui={gui.__folders["Audio"].domElement}></GUIMount>}
                        {index === 3 && gui && <GUIMount gui={gui.__folders["Settings"].domElement}></GUIMount>}
                        {index === 4 && gui && <GUIMount gui={gui.__folders["Export"].domElement}></GUIMount>}
                    </SimpleBar>
                </div>
            </div>
        )
    }
}
