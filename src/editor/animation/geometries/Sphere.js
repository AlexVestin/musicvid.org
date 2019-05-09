
import { SphereGeometry } from 'three';

export default class Sphere extends SphereGeometry {
    constructor(info) {
        super(5, 32, 32);

        this.path = "geometry";
        this.__item = info.parent;

    }

    __setUpGUI = (folder) => {
        const i = this.__item; 
        i.addController(folder, this, "impact", { min: 0, path: this.path });
        i.addController(folder, this.configs, "width", { path: this.path}).disableAutomations().min(0).onChange(this.uc);
        i.addController(folder, this.configs, "height", { path: this.path}).disableAutomations().min(0).onChange(this.uc);
        i.addController(folder, this.configs, "widthSegments", { path: this.path}).disableAutomations().min(0).step(1).onChange(this.uc);
        i.addController(folder, this.configs, "heightSegments", { path: this.path}).disableAutomations().min(0).step(1).onChange(this.uc);
    }
}