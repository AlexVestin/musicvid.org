

import MeshItem from '../MeshItem'

export default class StarNest extends MeshItem {
    constructor(info) {
        super(info);
        this.name = "StarNest";
        this.changeGeometry("Plane");
        this.changeMaterial("StarNest");        
        this.setUpFolder();
    }
}