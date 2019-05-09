
import { ConeGeometry } from 'three';

export default class Cone extends ConeGeometry {
    constructor(parent, info) {
        const config = {
            radius: 20, 
            height: 20,
            radialSegments: 8,
            heightSegments: 1,
            openEnded: false,
            thetaStart: 0,
            thetaLength: 2*Math.PI,
            ...info
        };

        const { radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength } = config;
        super(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
        this.configs = config;
        this.parent = parent;
        this.path = "geometry";
    }

    uc = () => this.parent.updateGeometry(this.configs);
    
    __setUpGUI = (folder) => {
        const i = this.parent; 
        i.addController(folder, this.configs, "radius").disableAutomations().onChange(this.uc);
        i.addController(folder, this.configs, "height", 0, 100, 1).disableAutomations().onChange(this.uc);
        i.addController(folder, this.configs, "radialSegments", 0, 100, 1).disableAutomations().onChange(this.uc);
        i.addController(folder, this.configs, "heightSegments", 0, 100, 1).disableAutomations().onChange(this.uc);
        i.addController(folder, this.configs, "thetaStart").disableAutomations().onChange(this.uc);
        i.addController(folder, this.configs, "thetaLength", 0, 100, 1).disableAutomations().onChange(this.uc);
    }
}