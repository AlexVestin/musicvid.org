
import MeshItem from '../MeshItem'

export default class SphereMesh extends MeshItem {

    constructor(info) {
        super(info);
        this.name = "Sphere";
        this.gui = info.gui;
        this.scene = info.scene;
        this.changeMaterial("HexaGone");  
        this.changeGeometry("Sphere");  
        this.setUpFolder();
    }

    update = (time, audioData) => {
        this.material.updateMaterial(time, audioData);
    }

}