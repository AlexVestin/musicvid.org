

import PlaneItem from './PlaneItem'


export default class HexaGone extends PlaneItem {
    constructor(info) {
        super(info);
        this.name = "HexaGone";
        this.changeGeometry("Plane");
        this.changeMaterial("HexaGone");        
        this.setUpFolder();
    }
}