
import * as THREE from 'three'
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'
import { loadImageTexture, loadImageTextureFromChoice } from 'editor/util/ImageLoader';
import { addOrthoMeshControls } from 'editor/util/AddMeshControls';

import BaseItem from '../BaseItem'

const vertexShader = [
    "varying vec2 vUv;",
    "void main() {",
        "vUv = uv;",
        "gl_Position =   projectionMatrix * modelViewMatrix * vec4(position,1.0);",
    "}",
].join("\n");

const fragmentShader = [
    "uniform sampler2D texture1;",
    "uniform bool should_vignette;",
    "uniform bool should_mirror;",
    "uniform float vignette_amt;",
    "varying vec2 vUv;",

    "void main() {",
        "vec2 pos  = vUv;",
        "if(should_mirror) {",
            "if(pos.x < 0.5) {",
                "pos.x = pos.x * 2.;",
            "}else {",
                "pos.x =  1. - (pos.x -0.5) * 2.;",
            "}",
        "}",

        "float vig_amt = 0.0;",
        "if(should_vignette)",
            "vig_amt = vignette_amt * length(vec2(0.5, 0.5) - vUv);",
        "gl_FragColor = texture2D(texture1, pos) - vig_amt;",
    "}"
].join("\n");


export default class Background extends BaseItem {

    constructor(info) {
        super(info);
        this.name = "Background";
        this.gui = info.gui;
        this.scene = info.scene;
        this.brightenToAudio = true;
        this.brightenMultipler = 1;
        this.vignetteAmount = 0.3;


        this.material = new THREE.ShaderMaterial( {
            uniforms: { 
                texture1: {type: "t", value: null }, 
                vignette_amt: {value: 0.3}, 
                should_vignette: {value: true}, 
                should_mirror: {value: true} 
            },
            vertexShader,
            fragmentShader,
        });
        
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
        this.scene.add(this.mesh);

        const url = "./img/space.jpeg";
        this.prevFile = url;
        loadImageTextureFromChoice(url, this.setBackground);
        this.__setUpFolder();
        
    }

    changeImage() {
        loadImageTexture(this, "setBackground");
    }

    setBackground = (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipMaps = false;
        this.material.uniforms.texture1.value = texture;
        this.material.needsUpdate = true;
    }
    

    update = (time, audioData) => {
        if(this.brightenToAudio && this.impactAnalyser) {
            const impact = this.impactAnalyser.analyse(audioData.frequencyData) ;
            this.material.uniforms.vignette_amt.value = this.vignetteAmount + impact * this.brightenMultipler * -0.0005;
        }
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "changeImage");
        folder.add(this.material.uniforms.should_vignette, "value", {name: "Enable Postprocessing"});
        folder.add(this, "brightenToAudio");
        folder.add(this, "brightenMultipler");           
        folder.add(this, "vignetteAmount").onChange(() => this.material.uniforms.value = this.vignetteAmount);
        folder.add(this.material.uniforms.should_mirror, "value", {name: "Mirror image"});
        this.impactAnalyser = new ImpactAnalyser(folder);
        this.impactAnalyser.endBin = 60;
        this.impactAnalyser.deltaDecay = 20;
        addOrthoMeshControls(this, this.mesh, folder);
        folder.updateDisplay();
        return this.__addFolder(folder);
    }
}