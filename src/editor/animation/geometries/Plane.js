
import { PlaneGeometry } from 'three';


export default class Plane extends PlaneGeometry {
    constructor(parent, info) {
        const config = {
            width: 2, 
            height: 2,
            widthSegments: 1,
            heightSegments: 1,
            ...info
        };


        super(config.width, config.height, config.widthSegments, config.heightSegments);
        this.configs = config;
        this.parent = parent;
        this.path = "geometry";
    }

    uc = () => this.parent.updateGeometry(this.configs);

    __setUpGUI = (folder) => {
        const i = this.parent; 
        i.addController(folder, this.configs, "width", { path: this.path}).disableAutomations().min(0).onChange(this.uc);
        i.addController(folder, this.configs, "height", { path: this.path}).disableAutomations().min(0).onChange(this.uc);
        i.addController(folder, this.configs, "widthSegments", { path: this.path}).disableAutomations().min(0).step(1).onChange(this.uc);
        i.addController(folder, this.configs, "heightSegments", { path: this.path}).disableAutomations().min(0).step(1).onChange(this.uc);
    }
}