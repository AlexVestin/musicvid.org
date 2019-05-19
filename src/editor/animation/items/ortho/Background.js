

import MeshItem from '../MeshItem'

export default class Background extends MeshItem {
    constructor(info) {
        super(info);
        this.name = "Background";     
        this.width = info.width;
        this.height = info.height;
        this.changeGeometry("Plane");
        this.changeMaterial("ImageMaterial");        
        this.setUpFolder();
    }
}