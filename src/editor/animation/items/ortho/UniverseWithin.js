

import PlaneItem from './PlaneItem'


export default class HexaGone extends PlaneItem {
    constructor(info) {
        super(info);
        this.name = "The Universe Within";
        this.changeMaterial("UniverseWithin");        
        this.setUpFolder();
    }
}