
import lerp from "lerp";
import * as THREE from "three";
import createCamera from "perspective-camera";
import { smooth, toWebAudioForm, getByteSpectrum } from 'audio/analyse_functions'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";


export default class Polartone {
    constructor(info) {
        this.positions = [];
        this.cursor = [0, 0, 0];
        this.dpr = window.devicePixelRatio;
        this.songDuration = 180;
        this.cameraX = 0;
        this.cameraY = -3.5;
        this.cameraZ = 0;
        this.amplitude = 1.0;
        this.extent = 0.1;
        this.scale = .2;
        this.capacity = 900;
        this.distance = 2;
        this.clearAlpha = 0.1;
        this.baseStrokeAlpha = 0.25;
        this.startBin = 0; 
        this.endBin = 450;

        this.width  = 0.5;
        this.height = 2;

        this.positionX  = 0;
        this.positionY  = 0;
        this.textureScale = 1.0;
        this.aspect = info.width/info.height;

        this.folder = this.setUpGUI(info.gui, "Polartone");
        this.prevArr = [];


        this.geometry = new THREE.BufferGeometry();
        this.linePositions = new Float32Array( 1024 * 3 ); // 3 vertices per point
        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.linePositions, 3 ) );

        var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        this.line = new THREE.Line( this.geometry,  material );
        info.scene.add( this.line );


    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "songDuration");
        folder.add(this, "cameraX");
        folder.add(this, "cameraY");
        folder.add(this, "cameraZ");
        folder.add(this, "amplitude");
        folder.add(this, "extent");
        folder.add(this, "capacity");
        folder.add(this, "distance");
        folder.add(this, "startBin");
        folder.add(this, "endBin");
        folder.add(this, "clearAlpha", 0, 1, 0.001);
        folder.add(this, "positionX", -2, 2, 0.01).onChange(() => this.mesh.position.x = this.positionX);
        folder.add(this, "positionY", -2, 2, 0.01).onChange(() => this.mesh.position.y = this.positionY);
        folder.add(this, "textureScale", -2, 2, 0.01).onChange(() => this.mesh.scale.set(this.textureScale, this.textureScale, this.textureScale) );


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
