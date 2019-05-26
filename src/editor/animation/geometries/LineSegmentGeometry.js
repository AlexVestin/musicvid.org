/**
 * @author WestLangley / http://github.com/WestLangley
 *
 */

import * as THREE from 'three';


export default class LineSegmentsGeometry extends THREE.InstancedBufferGeometry {
    constructor() {
        super();
        
        this.type = 'LineSegmentsGeometry';

        var plane = new THREE.BufferGeometry();

        var positions = [ - 1, 2, 0, 1, 2, 0, - 1, 1, 0, 1, 1, 0, - 1, 0, 0, 1, 0, 0, - 1, - 1, 0, 1, - 1, 0 ];
        var uvs = [ - 1, 2, 1, 2, - 1, 1, 1, 1, - 1, - 1, 1, - 1, - 1, - 2, 1, - 2 ];
        var index = [ 0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3, 4, 6, 5, 6, 7, 5 ];

        this.isLineSegmentsGeometry= true
        this.setIndex( index );
        this.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        this.addAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );
    }

    applyMatrix =  ( matrix ) => {

		var start = this.attributes.instanceStart;
		var end = this.attributes.instanceEnd;

		if ( start !== undefined ) {

			matrix.applyToBufferAttribute( start );

			matrix.applyToBufferAttribute( end );

			start.data.needsUpdate = true;

		}

		if ( this.boundingBox !== null ) {

			this.computeBoundingBox();

		}

		if ( this.boundingSphere !== null ) {

			this.computeBoundingSphere();

		}

		return this;

    }
    
    setPositions = ( array ) => {

		var lineSegments;

		if ( array instanceof Float32Array ) {

			lineSegments = array;

		} else if ( Array.isArray( array ) ) {

			lineSegments = new Float32Array( array );

        }
        
        console.log(lineSegments)

		var instanceBuffer = new THREE.InstancedInterleavedBuffer( lineSegments, 6, 1 ); // xyz, xyz

		this.addAttribute( 'instanceStart', new THREE.InterleavedBufferAttribute( instanceBuffer, 3, 0 ) ); // xyz
		this.addAttribute( 'instanceEnd', new THREE.InterleavedBufferAttribute( instanceBuffer, 3, 3 ) ); // xyz

		this.computeBoundingBox();
		this.computeBoundingSphere();

		return this;

    }
    
    setColors = ( array ) => {

		var colors;

		if ( array instanceof Float32Array ) {

			colors = array;

		} else if ( Array.isArray( array ) ) {

			colors = new Float32Array( array );

		}

		var instanceColorBuffer = new THREE.InstancedInterleavedBuffer( colors, 6, 1 ); // rgb, rgb

		this.addAttribute( 'instanceColorStart', new THREE.InterleavedBufferAttribute( instanceColorBuffer, 3, 0 ) ); // rgb
		this.addAttribute( 'instanceColorEnd', new THREE.InterleavedBufferAttribute( instanceColorBuffer, 3, 3 ) ); // rgb

		return this;

    }
    
    

	fromWireframeGeometry = ( geometry )  =>  {

		this.setPositions( geometry.attributes.position.array );

		return this;

	}

	fromEdgesGeometry = ( geometry ) => {

		this.setPositions( geometry.attributes.position.array );

		return this;

	}

	fromMesh =  ( mesh ) => {

		this.fromWireframeGeometry( new THREE.WireframeGeometry( mesh.geometry ) );

		// set colors, maybe

		return this;

	}

	fromLineSegements = ( lineSegments ) => {

		var geometry = lineSegments.geometry;

		if ( geometry.isGeometry ) {

			this.setPositions( geometry.vertices );

		} else if ( geometry.isBufferGeometry ) {

			this.setPositions( geometry.position.array ); // assumes non-indexed

		}

		// set colors, maybe

		return this;

    }
    
    
	computeBoundingBox = () => {

		var box = new THREE.Box3();

		const computeBoundingBox = () => {

			if ( this.boundingBox === null ) {

				this.boundingBox = new THREE.Box3();

			}

			var start = this.attributes.instanceStart;
            var end = this.attributes.instanceEnd;
            console.log(start, end, this.attributes)

			if ( start !== undefined && end !== undefined ) {

				this.boundingBox.setFromBufferAttribute( start );

				box.setFromBufferAttribute( end );

				this.boundingBox.union( box );

			}

        };
        
        return computeBoundingBox();

    }
    
    computeBoundingSphere = ()  => {

		var vector = new THREE.Vector3();

		const computeBoundingSphere = () => {

			if ( this.boundingSphere === null ) {

				this.boundingSphere = new THREE.Sphere();

			}

			if ( this.boundingBox === null ) {

				this.computeBoundingBox();

			}

			var start = this.attributes.instanceStart;
			var end = this.attributes.instanceEnd;

			if ( start !== undefined && end !== undefined ) {

				var center = this.boundingSphere.center;

				this.boundingBox.getCenter( center );

				var maxRadiusSq = 0;

				for ( var i = 0, il = start.count; i < il; i ++ ) {

					vector.fromBufferAttribute( start, i );
					maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( vector ) );

					vector.fromBufferAttribute( end, i );
					maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( vector ) );

				}

				this.boundingSphere.radius = Math.sqrt( maxRadiusSq );

				if ( isNaN( this.boundingSphere.radius ) ) {

					console.error( 'THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.', this );

				}

			}

        };
        
        return computeBoundingSphere();

    }
    
    toJSON =  () => {
		// todo
	}

	clone = () => {
		// todo
	}

	copy = ( source ) => {
		return this;
	}
}

