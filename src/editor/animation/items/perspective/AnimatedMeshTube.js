import {
   Vector3, Vector2, Color, CatmullRomCurve3, DoubleSide
} from 'three';

import Line2 from '../../geometries/Line2'
import LineGeometry from '../../geometries/LineGeometry'
import LineMaterial from '../../materials/LineMaterial'



  
const getRandomFloat = (min, max) => (Math.random() * (max - min)) + min;

export default class AnimatedMeshLine extends Line2 {
  constructor({
    width = 10,
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

    // * ******************************
    // * Create the MeshLineGeometry
    
    var positions2 = [];

    linePoints.forEach(point => {
      positions2.push(point.x);
      positions2.push(point.y);
  
      positions2.push(point.z);
    })
    // THREE.Line2 ( LineGeometry, LineMaterial )
    var geometry = new LineGeometry();


    console.log(width)
    const matLine = new LineMaterial( {
        color: new Color(color),
        linewidth: width, // in pixels
        resolution: new Vector2(1280, 720),  // to be set by renderer, eventually
        dashed: false,
        transparent: true,
        side: DoubleSide,
        opacity: 0.3
    } );

    super(geometry, matLine);
    this.lineWidth = width;
    this.visibleLength = visibleLength;
    this.geometry.setPositions(positions2);
    this.computeLineDistances();
    this.__positions = positions2;

    this.__points = linePoints;

    this.speed = speed;
    this.currentPosition = 0;
    this.update = this.update.bind(this);
  }


  /**
   * * *******************
   * * UPDATE
   * * *******************
   */
  update(mult, opacity) {

    const from = Math.floor(this.currentPosition * this.__positions.length);
    const to = Math.floor((this.currentPosition + this.visibleLength) * this.__positions.length);
    const fromPadded = from - (from % 3);
    const toPadded = to - (to - fromPadded) % 3;

    const p = this.__positions.slice(fromPadded, toPadded);
    if(p.length >= 6 && toPadded < this.__positions.length) {
      this.geometry.setPositions(p);
      this.computeLineDistances();
    }

    if (this.isDying()) {
      this.material.uniforms.opacity = opacity;
      this.material.opacity = opacity * ((1.05 - this.currentPosition) * 10);
    } else {
      this.material.uniforms.opacity.value = opacity;
      this.material.opacity = opacity;
    }
    
    this.currentPosition += this.speed * mult;
  }


  /**
   * * *******************
   * * CONDITIONS
   * * *******************
   */
  isDied() {
    return this.currentPosition >= 1.05;
  }

  isDying() {
    return this.currentPosition >= 0.95;
  }
}