
import lerp from "lerp";
import * as THREE from "three";
import createCamera from "perspective-camera";
import { toWebAudioForm, getByteSpectrum } from 'audio/analyse_functions'
import BaseItem from './BaseItem'


export default class Polartone extends BaseItem {
    constructor(info) {
        super();
        this.positions = [];
        this.cursor = [0, 0, 0];
        this.dpr = window.devicePixelRatio;
        this.songDuration = 180;
        this.cameraX = 0;
        this.cameraY = -3.5;
        this.cameraZ = 0;
        this.amplitude = 1.0;
        this.extent = 0.65;
        this.scale = .2;
        this.capacity = 900;
        this.distance = 0.35;
        this.clearAlpha = 0.1;
        this.baseStrokeAlpha = 0.25;
        this.startBin = 0; 
        this.endBin = 450;

        this.positionX  = 0;
        this.positionY  = 0;
        this.textureScale = 1.0;
        this.aspect = info.width/info.height;

        this.folder = this.setUpGUI(info.gui, "Polartone");

        const shape = [2, 2];
        this.camera = createCamera({
            fov: Math.PI / 4,
            near: 0.01,
            far: 100,
            viewport: [0, 0, ...shape]
        });

        this.prevArr = [];

        
        this.camera.identity();
        this.camera.translate([this.cameraX, this.cameraY, this.cameraZ]);
        this.camera.lookAt([0, 0, 0]);
        this.camera.update();
        

        this.geometry = new THREE.BufferGeometry();
        this.linePositions = new Float32Array( this.capacity * 3 ); // 3 vertices per point
        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.linePositions, 3 ) );

        var material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
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
        const subspectrum = data.frequencyData.slice(this.startBin, this.endBin)
        let waf = toWebAudioForm(subspectrum, this.prevArr, 0.1);
        this.prevArr = waf;
        const audioData = getByteSpectrum(waf).map(e => e / 10);
        


        const dur = time / this.songDuration;
        const bufferLength = audioData.length;
        let radius = 1 //- dur;
        const startAngle = time;

        var linePos = this.line.geometry.attributes.position.array;
        let index = 0;

        for (let i = this.positions.length - 1; i >= 0; i--) {
            var pos = this.positions[i];
            linePos[index++] = pos[0];
            linePos[index++] = pos[1];
            linePos[index++] = 0;
        }

        for (let i = 0; i < bufferLength; i++) {
            const lAlpha = i / (bufferLength - 1);
            const angle = lerp(
                startAngle + this.distance,
                startAngle,
                lAlpha
            );
            
            const amplitude = (audioData[i] / 128.0) * this.amplitude;
            const waveY = (amplitude * this.extent) / 2;
            
            this.cursor[0] = Math.cos(angle) * radius;
            this.cursor[2] = Math.sin(angle) * radius;

            const adjusted = [
                this.cursor[0],
                this.cursor[1] - waveY,
                this.cursor[2]
            ];

            
            const [x, y] = this.camera.project(adjusted);
            if (this.positions.length > this.capacity) {
                this.positions.shift();
            }

            this.positions.push([
                (x-1) / this.aspect,
                (y-1)
            ]);
        }

       this.line.geometry.attributes.position.needsUpdate = true;
    };
}
