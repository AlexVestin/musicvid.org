
import { SphereGeometry } from 'three';

export default class Sphere extends SphereGeometry {
    constructor(parent, info) {
        const configs = {
            radius: 5,
            heightSegments: 6,
            widthSegments: 8,
            phiStart: 0,
            phiLength: Math.PI * 2,
            thetaStart: 0,
            thetaLength: Math.PI,
            ...info
        };

        const { radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength } = configs;
        super(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);

        this.configs = configs;
        this.parent = parent;
        this.path = "geometry";

    }

    uc = () => this.parent.updateGeometry(this.configs);

    __setUpGUI = (folder) => {
        const i = this.parent; 
        i.addController(folder, this.configs, "radius", { path: this.path}).disableAutomations().min(0).onChange(this.uc);
        i.addController(folder, this.configs, "widthSegments", { path: this.path}).disableAutomations().min(0).step(1).onChange(this.uc);
        i.addController(folder, this.configs, "heightSegments", { path: this.path}).disableAutomations().min(0).step(1).onChange(this.uc);
        i.addController(folder, this.configs, "phiStart", { path: this.path}).disableAutomations().min(0).onChange(this.uc);
        i.addController(folder, this.configs, "phiLength", { path: this.path}).disableAutomations().min(0).onChange(this.uc);
        i.addController(folder, this.configs, "thetaStart", { path: this.path}).disableAutomations().min(0).onChange(this.uc);
        i.addController(folder, this.configs, "thetaLength", { path: this.path}).disableAutomations().min(0).onChange(this.uc);
    }
}