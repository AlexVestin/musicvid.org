import * as THREE from "three";
import { smooth, toWebAudioForm, getByteSpectrum } from 'editor/audio/analyse_functions'
import BaseItem from '../BaseItem'


export default class PointBed extends BaseItem {
    
    constructor(info) {
        super(info);
        this.name = "LineBed";
        this.prevArr = [];
        this.amplitude = 2.5;

        this.particles = [];
        this.group = new THREE.Group();
        this.spacing = 20;
        this.lineLength =  9;

        this.updateCount = 0;
        this.size = 256*4;

        this.nrLines = 200;
        for(var ix = 0; ix < this.nrLines; ix++) {
            var geometry = new THREE.BufferGeometry();
            var positions = new Float32Array(this.size * 3);
            for(var i = 0; i < this.size; i++) {
                positions[i*3] =  i*this.lineLength;
                positions[i*3+1] = 0;
                positions[i*3+2] = -(this.nrLines/2)*this.spacing + ix*this.spacing + 1;
            }

            let rel = ix/ this.nrLines;
            const color = new THREE.Color(rel,rel,rel);
            geometry.addAttribute(
                "position",
                new THREE.BufferAttribute(positions, 3)
            );


            const material = new THREE.MeshBasicMaterial({color: color});
            const mesh = new THREE.Line(geometry, material)
            this.particles.push(mesh);
            this.group.add(mesh)
        }


        info.scene.add(this.group);
        this.__setUpFolder();
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "amplitude");
        return this.__addFolder(folder);
    };

    update = (time, data) => {

        if(this.updateCount++ % 2 === 0) {
            let waf = toWebAudioForm(data.frequencyData.slice(0, data.frequencyData.length /2), this.prevArr, 0.1);
            this.prevArr = waf;
            let freq = getByteSpectrum(waf);
            freq = smooth(freq,  { smoothingPasses: 3, smoothingPoints: 9 })    
    
            let i = this.particles.length - 2;
            while (i > 0) {
                const line = this.particles[i];
                const prevLine = this.particles[i - 1];
    
                let rel = Math.max( 1. - (i / this.nrLines) - 0.1, 0);
                const color = new THREE.Color(rel,rel,rel);
                for(var j = 0; j < prevLine.geometry.attributes.position.array.length; j+=3) {
                    line.geometry.attributes.position.array[j+1] = prevLine.geometry.attributes.position.array[j+1];
                }   
                line.material.color = color; 
                line.material.needsUpdate = true;
                line.geometry.attributes.position.needsUpdate = true;
                i--;
            }
    
            const arr = this.particles[0].geometry.attributes.position.array;
            for(i = 0; i < freq.length*3; i+=3) {
                arr[i + 1] = freq[i] * this.amplitude;
            }
            this.particles[0].material.color = new THREE.Color(1, 1, 1);
            this.particles[0].material.needsUpdate = true;
            this.particles[0].geometry.attributes.position.needsUpdate = true;
        }
       
    };
}
