

import MeshItem from '../MeshItem'

export default class HexaGone extends MeshItem {
    constructor(info) {
        super(info);
        this.name = "HexaGone";
        this.changeGeometry("Plane");
        this.changeMaterial("HexaGone");        
        this.setUpFolder();
    }
}