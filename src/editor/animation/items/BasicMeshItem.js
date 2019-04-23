

import MeshItem from './MeshItem'

export default class BasicMeshItem extends MeshItem {
    constructor(info) {
        super(info);
        this.name = "Basic Mesh Item";
        this.changeGeometry("Plane");
        this.changeMaterial("MeshBasicMaterial");        
        this.setUpFolder();
    }
}