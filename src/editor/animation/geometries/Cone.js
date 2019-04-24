
import { ConeGeometry } from 'three';
export default class Cone extends ConeGeometry {
    constructor(update, info) {
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

        const { radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength } = config
        super(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
        this.updateGeometry = update;
        this.configs = config;
    }

    uc = () => this.updateGeometry(this.configs);
    
    __setUpGUI = (folder) => {
        folder.add(this.configs, "radius").disableAutomations().onChange(this.uc);
        folder.add(this.configs, "height", 0, 100, 1).disableAutomations().onChange(this.uc);
        folder.add(this.configs, "radialSegments", 0, 100, 1).disableAutomations().onChange(this.uc);
        folder.add(this.configs, "heightSegments", 0, 100, 1).disableAutomations().onChange(this.uc);
        folder.add(this.configs, "thetaStart").disableAutomations().onChange(this.uc);
        folder.add(this.configs, "thetaLength", 0, 100, 1).disableAutomations().onChange(this.uc);
    }
}