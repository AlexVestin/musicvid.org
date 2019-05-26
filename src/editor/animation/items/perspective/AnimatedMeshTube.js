import {
    Mesh, Vector3, Vector2, SplineCurve, Geometry, Color, CatmullRomCurve3
  } from 'three';
import LineGeometry from '../../geometries/LineGeometry';
import LineMaterial from '../../materials/LineMaterial'
import Line2 from '../../geometries/Line2';


  import * as THREE from 'three';
    
  const getRandomFloat = (min, max) => (Math.random() * (max - min)) + min;

  export default class AnimatedMeshLine extends Line2 {
    constructor({
      width = 0.1,
      speed = 0.01,
      visibleLength = 0.5,
      color = new Color('#000000'),
      opacity = 1,
      position = new Vector3(0, 0, 0),
  
      // Array of points already done
      points = false,
      // Params to create the array of points
      length = 2,
      nbrOfPoints = 3,
      orientation = new Vector3(1, 0, 0),
      turbulence = new Vector3(0, 0, 0),
      transformLineMethod = false,
      nrPrecisionPoints = 50,
    } = {}) {
      // * ******************************
      // * Create the main line
      let linePoints = [];
      if (!points) {
        const currentPoint = new Vector3();
        // The size of each segment oriented in the good directon
        const segment = orientation.normalize().multiplyScalar(length / nbrOfPoints);
        linePoints.push(currentPoint.clone());
        for (let i = 0; i < nbrOfPoints - 1; i++) {
          // Increment the point depending to the orientation
          currentPoint.add(segment);
          // Add turbulence to the current point
          linePoints.push(currentPoint.clone().set(
            currentPoint.x + getRandomFloat(-turbulence.x, turbulence.x),
            currentPoint.y + getRandomFloat(-turbulence.y, turbulence.y),
            currentPoint.z + getRandomFloat(-turbulence.z, turbulence.z),
          ));
        }
        // Finish the curve to the correct point without turbulence
        linePoints.push(currentPoint.add(segment).clone());
        // * ******************************
        // * Smooth the line
        // TODO 3D spline curve https://math.stackexchange.com/questions/577641/how-to-calculate-interpolating-splines-in-3d-space
        // TODO https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_nurbs.html
        const curve = new CatmullRomCurve3(linePoints);
        linePoints = curve.getPoints(nrPrecisionPoints);
      } else {
        linePoints = points;
      }

      var geometry = new LineGeometry();
      console.log(linePoints);
      geometry.__setPositions( linePoints );
      //geometry.setColors( colors );
      const matLine = new LineMaterial( {
          color: 0xffffff,
          linewidth: 5, // in pixels
          vertexColors: THREE.VertexColors,
          //vertexColors: THREE.VertexColors,
          //resolution:  // to be set by renderer, eventually
          dashed: false
      } );
    
      //scene.add( line );
      super(geometry, matLine);
      this.computeLineDistances();
      this.scale.set( 1, 1, 1 );

      this.__points = linePoints;
      this.dyingAt = 1;
      this.diedAt = this.dyingAt + this.dashLength;
      this.update = this.update.bind(this);
    }
  
  
    /**
     * * *******************
     * * UPDATE
     * * *******************
     */
    update(mult) {
      // Increment the dash
      /*
      this.material.uniforms.dashOffset.value -= this.speed * mult;
      console.log(this.material.uniforms.dashOffset)
  
      // TODO make that into a decorator
      // Reduce the opacity then the dash start to desapear
      if (this.isDying()) {
        this.material.uniforms.opacity.value = 0.9 + ((this.material.uniforms.dashOffset.value + 1) / this.dashLength);
      }*/
    }
  
  
    /**
     * * *******************
     * * CONDITIONS
     * * *******************
     */
    isDied() {
      //return this.material.uniforms.dashOffset.value < -this.diedAt;
    }
  
    isDying() {
      //return this.material.uniforms.dashOffset.value < -this.dyingAt;
    }
  }