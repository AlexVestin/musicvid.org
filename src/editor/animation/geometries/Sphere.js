
import { SphereGeometry } from 'three';
import serialize from '../Serialize'

export default class Sphere extends SphereGeometry {
    constructor(info) {
        super(5, 32, 32);

    }

    __setUpGUI = ( ) => {

    }

    __serialize = () => {
        return serialize(this);
    }
}