

import MeshItem from '../MeshItem'

export default class OctaveMeatballs extends MeshItem {
    constructor(info) {
        super(info);
        this.name = "Octave Meatballs";
        this.changeGeometry("Plane");
        this.changeMaterial("OctaveMeatballs");        
        this.setUpFolder();
    }
}