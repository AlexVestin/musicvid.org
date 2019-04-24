
import { PlaneGeometry } from 'three';


export default class Plane extends PlaneGeometry {
    constructor(update, info) {
        const config = {
            width: 2, 
            height: 2,
            widthSegments: 1,
            heightSegments: 1,
            ...info
        };


        super(config.width, config.height, config.widthSegments, config.heightSegments);
        this.updateGeometry = update;
        this.configs = config;
    }

    uc = () => this.updateGeometry(this.configs)

    __setUpGUI = (folder) => {
        folder.add(this.configs, "width").disableAutomations().min(0).onChange(this.uc);
        folder.add(this.configs, "height").disableAutomations().min(0).onChange(this.uc);
        folder.add(this.configs, "widthSegments").disableAutomations().min(0).step(1).onChange(this.uc);
        folder.add(this.configs, "heightSegments").disableAutomations().min(0).step(1).onChange(this.uc);
    }
}