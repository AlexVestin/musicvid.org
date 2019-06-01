

import BaseItem from '../BaseItem';
import LineMaterial from '../../materials/LineMaterial';
import LineGeometry from '../../geometries/LineGeometry';
import Line2 from '../../geometries/Line2';

import * as THREE from 'three';
import {hilbert3D} from './hilbert3d'
import { Vector2 } from 'three';

export default class Noise extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Electric Noise";


        var positions = [];
        var colors = [];
        var points = hilbert3D( new THREE.Vector3( 0, 0, 0 ), 20.0, 1, 0, 1, 2, 3, 4, 5, 6, 7 );
        var spline = new THREE.CatmullRomCurve3( points );
        var divisions = Math.round( 12 * points.length );
        var color = new THREE.Color();
        for ( var i = 0, l = divisions; i < l; i ++ ) {
            var point = spline.getPoint( i / l );
            positions.push( point.x, point.y, point.z );
            color.setHSL( i / l, 1.0, 0.5 );
            colors.push( color.r, color.g, color.b );
        }
        // THREE.Line2 ( LineGeometry, LineMaterial )
        var geometry = new LineGeometry();
        geometry.setPositions( positions );
        this.matLine = new LineMaterial( {
            color: 0xffffff,
            linewidth: 0.01, // in pixels
            resolution: new Vector2(info.width, info.height),  // to be set by renderer, eventually
            dashed: false
        } );
        const line = new Line2( geometry, this.matLine );
        line.computeLineDistances();
        line.scale.set( 1, 1, 1 );
        info.scene.add( line );
      
        this.setUpFolder();
    }

    __setUpGUI = (folder) => {
        this.addController(folder, this.matLine, "linewidth");
    }
}