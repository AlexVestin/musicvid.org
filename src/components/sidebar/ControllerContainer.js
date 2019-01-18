import React, { PureComponent } from 'react'
import Layers from './Layers'
import MasterSettings from './MasterSettings'
import classes from './ControllerContainer.module.css'

export default class ControllerContainer extends PureComponent {
    
    constructor() {
        super();

        this.mountRef = React.createRef();
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

    recursivelyAddOnchange = (folder) => {
        folder.__controllers.forEach(controller => {
   
            //controller.onChange( this.onChange )
        })

        Object.keys(folder.__folders).forEach(key => {
            const f = folder.__folders[key];
            this.recursivelyAddOnchange(f);
        })
    }

    debugMouseDown = () => {
        const { gui } = this.props;
        gui.updateDisplay();
        if(this.layers.layers[0]) {
            if(!this.added) {
                this.added = true;
                //this.gui.add(this.layers.layers[0], "name")
                //this.recursivelyAddOnchange(this.gui);
            }
        }
    }

    componentDidMount() {
        const { gui } = this.props;
        this.layers = new Layers(gui);
        this.masterSettings = new MasterSettings(gui);
        this.mountRef.current.appendChild(gui.domElement);
        gui.add(this, "exportVideo");
        window.onmousedown = this.debugMouseDown;
    }
  
    render() {
        return (
            <div className={classes.container}>
                <div className={classes.headerButtons}>
                    <div>overview</div>
                    <div>layers</div>
                    <div>audio</div>
                    <div>settings</div>
                    <div>export</div>

                </div>
                <div  ref={this.mountRef} ></div>
            </div>
        )
  }
}
