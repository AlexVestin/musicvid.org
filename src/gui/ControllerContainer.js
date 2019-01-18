import React, { PureComponent } from 'react'
import * as dat from 'dat.gui'
import Layers from './Layers'
import MasterSettings from './MasterSettings'

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
        this.gui.updateDisplay();
        if(this.layers.layers[0]) {
            if(!this.added) {
                this.added = true;
                //this.gui.add(this.layers.layers[0], "name")
                //this.recursivelyAddOnchange(this.gui);
            }
        }
    }

    componentDidMount() {
        this.gui = new dat.GUI({autoPlace: false});
        this.layers = new Layers(this.gui);
        this.masterSettings = new MasterSettings(this.gui);
        this.mountRef.current.appendChild(this.gui.domElement);
        this.gui.add(this, "exportVideo");

        window.onmousedown = this.debugMouseDown;
    }
  
    render() {
        return (
            <div ref={this.mountRef}></div>
        )
  }
}
