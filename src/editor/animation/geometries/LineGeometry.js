// noprotect
/**
 * @author WestLangley / http://github.com/WestLangley
 *
 */

import LineSegmentsGeometry from './LineSegmentGeometry';

 export default class LineGeometry extends LineSegmentsGeometry {
     constructor() {
         super();

         this.type = 'LineGeometry';
         this.isLineGeometry = true;
     }

    __setPositions = ( array ) => {
		// converts [ x1, y1, z1,  x2, y2, z2, ... ] to pairs format
		var length = array.length - 3;
		var points = new Float32Array( 2 * length );

		for ( var i = 0; i < length; i += 3 ) {

			points[ 2 * i ] = array[ i ];
			points[ 2 * i + 1 ] = array[ i + 1 ];
			points[ 2 * i + 2 ] = array[ i + 2 ];

			points[ 2 * i + 3 ] = array[ i + 3 ];
			points[ 2 * i + 4 ] = array[ i + 4 ];
			points[ 2 * i + 5 ] = array[ i + 5 ];
		}
		this.setPositions(points);
		return this;
    }
    
    __setColors = ( array ) => {
		// converts [ r1, g1, b1,  r2, g2, b2, ... ] to pairs format
		var length = array.length - 3;
		var colors = new Float32Array( 2 * length );

		for ( var i = 0; i < length; i += 3 ) {

			colors[ 2 * i ] = array[ i ];
			colors[ 2 * i + 1 ] = array[ i + 1 ];
			colors[ 2 * i + 2 ] = array[ i + 2 ];

			colors[ 2 * i + 3 ] = array[ i + 3 ];
			colors[ 2 * i + 4 ] = array[ i + 4 ];
			colors[ 2 * i + 5 ] = array[ i + 5 ];

		}
		this.setColors(colors );
		return this;
    }
    
    fromLine = ( line ) => {
		var geometry = line.geometry;
		if ( geometry.isGeometry ) {
			this.__setPositions( geometry.vertices );
		} else if ( geometry.isBufferGeometry ) {
			this.__setPositions( geometry.position.array ); // assumes non-indexed
		}
		return this;
    }
    
    
	copy = ( source ) => {
		return this;
	}
 }
