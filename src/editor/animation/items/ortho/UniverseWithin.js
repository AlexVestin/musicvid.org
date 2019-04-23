

import MeshItem from '../MeshItem'


export default class HexaGone extends MeshItem {
    constructor(info) {
        super(info);
        this.name = "The Universe Within";
        this.changeMaterial("UniverseWithin");        
        this.setUpFolder();
    }
}