

import PlaneItem from './PlaneItem'
import ImageMaterial from '../../materials/ImageMaterial';

export default class Background extends PlaneItem {

    constructor(info) {
        super(info);
        this.name = "Background";     
        this.material = new ImageMaterial();
        this.mesh.material = this.material;
        this.setUpFolder();
    }
}