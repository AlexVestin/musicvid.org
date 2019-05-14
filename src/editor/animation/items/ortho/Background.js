

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

    onImageChange = (image) => {
        const ca = this.width/this.height;
        const ia = image.width / image.height;

        const s = ca / ia;
        if(s > 1) {
            this.mesh.scale.set(s, 1, 1);    
        }else {
            this.mesh.scale.set(1, ia/ca, 1);    
        }        
    }
}