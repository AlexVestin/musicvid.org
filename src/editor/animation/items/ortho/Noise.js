

import MeshItem from '../MeshItem'

export default class Noise extends MeshItem {
    constructor(info) {
        super(info);
        this.name = "Electric Noise";
        this.changeGeometry("Plane");
        this.changeMaterial("Noise");        
        this.setUpFolder();
    }
}