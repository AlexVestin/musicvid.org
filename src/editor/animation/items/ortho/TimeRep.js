
import * as THREE from "three";
import BaseItem from '../BaseItem'
import { addOrthoMeshControls } from 'editor/util/AddMeshControls';

export default class AudioWave extends BaseItem{
    constructor(info) {
        super(info);
        this.name = "Audio Wave";

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

        const material = new THREE.LineBasicMaterial( { color: this.color } );
        this.mesh = new THREE.Line( this.geometry,  material );

        //Needs to be here for orthomeshcontrols
        material.wireframe = false;
        info.scene.add( this.mesh );
        this.mesh.position.y = this.positionY;
        this.__setUpFolder();
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "amplitude", 0, 10.0, 0.01);
        folder.add(this, "extent", 0, 2.0, 0.01);
        folder.add(this, "width", 0, 5.0, 0.01);
        folder.addColor(this, "color").onChange(() => this.mesh.material.color = new THREE.Color(this.color));
        folder.add(this.mesh.material, "linewidth", 0, 10, 1).onChange(()=>this.mesh.material.needsUpdate = true);

        addOrthoMeshControls(this, this.mesh, folder);
        return this.__addFolder(folder);
    };

    update = (time, data) => {
        const audioData = data.timeData;
        const bufferLength = audioData.length;
        var linePos = this.mesh.geometry.attributes.position.array;

        if(bufferLength * 3 !== linePos.length) {
            this.geometry = new THREE.BufferGeometry();
            this.linePositions = new Float32Array( bufferLength * 3 ); // 3 vertices per point
            this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.linePositions, 3 ) );
            this.mesh.geometry = this.geometry;
            linePos = this.mesh.geometry.attributes.position.array;
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


       this.mesh.geometry.attributes.position.needsUpdate = true;
    };
}
