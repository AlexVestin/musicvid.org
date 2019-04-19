

import * as THREE from 'three'
import ShaderToyMaterial from 'editor/util/ShaderToyMaterial'
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'
import BaseItem from '../BaseItem'
import fragShader from '../../shaders/licensed/HexaGone'

export default class HexaGone extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "HexaGone";
        this.geo = new THREE.PlaneGeometry(2,2);
        this.mat = new ShaderToyMaterial(fragShader, 
            {
                uniforms: { 
                    iResolution: {value: new THREE.Vector2(info.width, info.height)},
                    iTime: {value: 0.0},
                    mult: {value: 4.0}
                }
            }
        );
        
        this.mesh = new THREE.Mesh(this.geo, this.mat);
        info.scene.add(this.mesh);
        this.time = 0;
        this.lastTime = 0;
        this.amplitude = 0.1;
        this.baseSpeed = 0.8;


        //GUi
        this.textureZoom = 4;
        this.__setUpFolder(info, this.name);
       
        this.impactAnalyser = new ImpactAnalyser(this.folder);
        this.impactAnalyser.endBin = 60;
        this.impactAnalyser.deltaDecay = 20;
        this.folder.updateDisplay();

     
        this.__attribution = {
            showAttribution: true,
            name:"HexaGone",
            authors: [
                {
                    name: "BigWIngs", 
                    social1: {type: "youtube", url: "https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg"},
                    social2: {type: "twitter", url: "https://twitter.com/The_ArtOfCode"},
                }
            ],
            projectUrl: "https://www.shadertoy.com/view/wsl3WB",
            description: "",
            license: this.LICENSE.REQUIRE_ATTRIBUTION,
            changeDisclaimer: true,
            imageUrl: "img/templates/HexaGone.png"
        }

        
    }


    setUpGUI = (gui, name) => {

        const folder = gui.addFolder(name);
        folder.add(this, "baseSpeed", -50, 50, 0.1);
        folder.add(this, "amplitude", -5, 5, 0.01);
        return this.__addFolder(folder);
    }

    stop = () => {
        this.time = 0;
        this.lastTime = 0;
    }

    update = (time, audioData) => {
        
        this.mat.uniforms.iTime.value = time;
        if( this.impactAnalyser) {
            const impact = this.impactAnalyser.analyse(audioData.frequencyData) ;
            this.time += this.baseSpeed * 0.01 + (time  - this.lastTime) * impact * this.amplitude / 10; 
            this.mat.uniforms.iTime.value = this.time ;
            this.lastTime = time;
        }
    }
}