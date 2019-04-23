
import { PlaneGeometry } from 'three';
export default class Plane extends PlaneGeometry {
    constructor(info) {
        super(2, 2);

        console.log(this);

    }

    __setUpGUI = (folder) => {

    }
}