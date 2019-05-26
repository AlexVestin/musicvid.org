/**
 * @author WestLangley / http://github.com/WestLangley
 *
 */

import LineGeometry from './LineGeometry';
import LineMaterial from '../materials/LineMaterial';

import LineSegments2 from './LineSegments2';
export default class Line2 extends LineSegments2 {
    constructor(geometry, material) {
        super(geometry, material);
        
        this.type = 'Line2';

        this.geometry = geometry !== undefined ? geometry : new LineGeometry();
        this.material = material !== undefined ? material : new LineMaterial( { color: Math.random() * 0xffffff } );
        this.isLine2 = true;
    }   
    copy =  ( source ) => {
		return this;
	}

}
