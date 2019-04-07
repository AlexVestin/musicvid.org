

import * as THREE from 'three'
import ShaderToyMaterial from 'editor/util/ShaderToyMaterial'
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'
import BaseItem from '../BaseItem'
import fragShader from '../../shaders/licensed/UniverseWithin'

export default class UniverseWithin extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Universe Within";
        
        this.geo = new THREE.PlaneGeometry(2,2);
        this.mat = new ShaderToyMaterial(fragShader, 
            {
                uniforms: { 
                    iResolution: {value: new THREE.Vector2(info.width, info.height)},
                    iTime: {value: 0.0},
                    mult: {value: 4.0},
                    fft: {value: 0.01},
                    NUM_LAYERS: {value: 4}
                }
            }
        );
        
        this.mesh = new THREE.Mesh(this.geo, this.mat);
        info.scene.add(this.mesh);
        this.time = 0;
        this.lastTime = 0;
        this.amplitude = 0.1;
        this.baseSpeed = 0.8;
        this.frequency = 0.02;
        this.moveToAudioImpact = true;
        this.numLayers = 4; 
        this.movementAmplitude = 1.0;


        //GUi
        this.textureZoom = 4;
        this.__setUpFolder();
        this.impactAnalyser = new ImpactAnalyser(this.folder);
        this.impactAnalyser.endBin = 60;
        this.impactAnalyser.deltaDecay = 20;
        this.folder.updateDisplay();

        this.__attribution = {
            showAttribution: true,
            name:"The Universe Within",
            authors: [
                {
                    name: "BigWIngs", 
                    social1: {type: "twitter", url: "https://twitter.com/The_ArtOfCode"},
                    social2: {type: "youtube", url: "https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg"},
                }
            ],
            projectUrl: "https://www.shadertoy.com/view/lscczl",
            description: "",
            license: this.LICENSE.REQUIRE_ATTRIBUTION,
            changeDisclaimer: true,
            imageUrl: "img/templates/UniverseWithin.png"
        }
    }


    setUpGUI = (gui, name) => {

        const folder = gui.addFolder(name);
        folder.add(this, "numLayers", [1,2,4,8]).onChange(() => this.mat.uniforms.NUM_LAYERS.value = this.numLayers);
        folder.add(this, "amplitude", 0, 1, 0.001);
        folder.add(this, "frequency", 0, 1, 0.01);
        folder.add(this, "moveToAudioImpact");
        folder.add(this, "baseSpeed", -50, 50, 0.1);
        folder.add(this, "movementAmplitude", -10,10,0.1);
        return this.__addFolder(folder);
    }

    stop = () => {
        this.time = 0;
        this.lastTime = 0;
    }

    update = (time, audioData, shouldIncrement) => {
        const idx = Math.floor( this.frequency*(audioData.frequencyData.length / 2) );
        
        this.mat.uniforms.iTime.value = time;
        if(this.moveToAudioImpact &&  this.impactAnalyser) {
            const impact = this.impactAnalyser.analyse(audioData.frequencyData) ;
            this.time += this.baseSpeed * 0.01 + (time  - this.lastTime) * impact * 0.01 * this.movementAmplitude; 
            this.mat.uniforms.iTime.value = this.time ;
        }
        
        this.mat.uniforms.fft.value = 0.01 + audioData.frequencyData[idx] * this.amplitude * 0.02;
        this.lastTime = time;
        
    }
}