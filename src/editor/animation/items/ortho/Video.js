

import MeshItem from '../MeshItem'

export default class Video extends MeshItem {
    constructor(info) {
        super(info);
        this.name = "Video";
        this.changeGeometry("Plane");
        this.changeMaterial("Video");        
        this.setUpFolder();
    }
}