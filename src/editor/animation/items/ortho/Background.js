

import MeshItem from '../MeshItem'

export default class Background extends MeshItem {
    constructor(info) {
        super(info);
        this.name = "Background";     
        this.changeGeometry("Plane");
        this.changeMaterial("ImageMaterial");        
        this.setUpFolder();
    }
}