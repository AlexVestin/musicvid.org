
import * as THREE from "three";
import BaseItem from './BaseItem'

export default class Polartone extends BaseItem{
    constructor(info) {
        super();

        this.amplitude = 1.0;
        this.extent = 0.1;
        this.baseStrokeAlpha = 0.25;
        this.startBin = 0; 
        this.endBin = 450;

        this.width  = 0.5;
        this.height = 2;
        this.color = "#FFFFFF";
        this.positionX  = 0;
        this.positionY  = 0.35;
        this.textureScale = 1.0;
        this.aspect = info.width/info.height;

        
        this.prevArr = [];


        this.geometry = new THREE.BufferGeometry();
        this.linePositions = new Float32Array( 1024 * 3 ); // 3 vertices per point
        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.linePositions, 3 ) );

        var material = new THREE.LineBasicMaterial( { color: this.color } );
        this.line = new THREE.Line( this.geometry,  material );
        info.scene.add( this.line );
        this.line.position.y = this.positionY;
        this.folder = this.setUpGUI(info.gui, "Polartone");
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "amplitude", 0, 10.0, 0.01);
        folder.add(this, "extent", 0, 2.0, 0.01);
        folder.add(this, "width", 0, 5.0, 0.01);
        folder.addColor(this, "color").onChange(() => this.line.material.color = new THREE.Color(this.color));
        folder.add(this.line.material, "linewidth", 0, 10, 0.01);
        folder.add(this, "positionX", -2, 2, 0.01).onChange(() => this.line.position.x = this.positionX);
        folder.add(this, "positionY", -2, 2, 0.01).onChange(() => this.line.position.y = this.positionY);
        folder.add(this, "textureScale", -2, 2, 0.01).onChange(() => this.line.scale.set(this.textureScale, this.textureScale, this.textureScale) );


        return folder;
    };

    update = (time, data) => {
        const audioData = data.timeData;
        const bufferLength = audioData.length;
        var linePos = this.line.geometry.attributes.position.array;
        if(bufferLength * 3 !== linePos.length) {
            this.geometry = new THREE.BufferGeometry();
            this.linePositions = new Float32Array( bufferLength * 3 ); // 3 vertices per point
            this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.linePositions, 3 ) );
            this.line.geometry = this.geometry;
            linePos = this.line.geometry.attributes.position.array;
        } 

        let index = 0;

        for(var i = 0; i < bufferLength; i++) {
        
            const x = ((i / bufferLength)*2 *this.width) -1 * this.width;
            const amplitude = audioData[i]  * this.amplitude;
            const y = (amplitude * this.extent) / 2;

            linePos[index++] = x;
            linePos[index++] = y;
            linePos[index++] = 0;
        }


       this.line.geometry.attributes.position.needsUpdate = true;
    };
}
