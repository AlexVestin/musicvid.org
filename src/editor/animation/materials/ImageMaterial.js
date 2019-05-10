import * as THREE from 'three';
import { loadImageTexture, loadImageTextureFromChoice } from 'editor/util/ImageLoader';
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'


import serialize from '../Serialize'


const vertexShader = [
    "varying vec2 vUv;",
    "void main() {",
        "vUv = uv;",
        "gl_Position =   projectionMatrix * modelViewMatrix * vec4(position,1.0);",
    "}",
].join("\n");

const fragmentShader = [
    "uniform sampler2D texture1;",
    "uniform bool enablePostProcessing;",
    "uniform bool should_mirror;",
    "uniform float vignette_amt;",
    "uniform float opacity;",

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
        "if(enablePostProcessing)",
            "vig_amt = vignette_amt * length(vec2(0.5, 0.5) - vUv);",

        
        "gl_FragColor = texture2D(texture1, pos) - vig_amt;",
        "gl_FragColor.a *= opacity;",
    "}"
].join("\n");



export default class ImageMaterial extends THREE.ShaderMaterial{
    constructor(item) {
        super()
        
        this.brightenToAudio = true;
        this.brightenMultipler = 1;
        this.vignetteAmount = 0.3;

        this.uniforms = { 
            texture1: {type: "t", value: null }, 
            vignette_amt: {value: 0.3}, 
            enablePostProcessing: {value: true}, 
            should_mirror: {value: true},
            opacity: {value: 1.0}
        }
        this.transparent = true;
        this.vertexShader = vertexShader; 
        this.fragmentShader = fragmentShader;
         
        const url = "./img/space.jpeg";
        this.prevFile = url;
        loadImageTextureFromChoice(url, this.setBackground);  

        this.path = "material";
        this.__item = item;
    }

    updateMaterial = (time, audioData) => {
        if(this.impactAnalyser) {
            const impact = this.impactAnalyser.analyse(audioData.frequencyData) ;
            this.uniforms.vignette_amt.value = this.vignetteAmount + impact * -this.brightenMultipler;
        }
    }

    changeImage() {
        loadImageTexture(this, "setBackground");
    }

    setBackground = (texture) => {
        this.imgController.setFileInfo({func: "setBackground", expectedType: "texture"});
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipMaps = false;
        this.uniforms.texture1.value = texture;
        this.needsUpdate = true;
    }

    __addUndoAction = (func, args) => {
        const item = {func: func, args: args, type: "action"};
        this.folder.getRoot().addUndoItem(item); 
    }

    __serialize = () => {
        return serialize(this);
    }
    
    __setUpGUI = (folder) => {
        const i = this.__item;
        i.addController(folder, this, "wireframe");
        this.imgController = i.addController(folder, this, "changeImage");
        i.addController(folder, this.uniforms.enablePostProcessing, "value").name("Enable Postprocessing");
        i.addController(folder,this, "brightenToAudio");
        i.addController(folder,this, "brightenMultipler");           
        i.addController(folder,this.uniforms.opacity, "value").name("opacity");
        i.addController(folder,this, "vignetteAmount").onChange(() => this.uniforms.value = this.vignetteAmount);
        i.addController(folder,this.uniforms.should_mirror, "value", {name: "Mirror image"});
        this.impactAnalyser = new ImpactAnalyser(folder, i);
        this.impactAnalyser.endBin = 60;
        this.impactAnalyser.deltaDecay = 20;
        this.folder = folder;
        return folder;
    }
}