
import * as THREE from 'three'
import ImpactAnalyser from '../../../audio/ImpactAnalyser'

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


export default class Background {

    constructor(info) {
        this.folder = info.gui.addFolder("Background");
        
        this.scene = info.scene;
        this.setBackground();

        this.brightenToAudio = true;
        this.brightenMultipler = 1;
        this.vignetteAmount = 0.3;
        
    }

    update = (time, audioData) => {
        if(this.brightenToAudio && this.impactAnalyser) {
            const impact = this.impactAnalyser.analyseImpact(audioData.frequencyData) ;
            this.material.uniforms.vignette_amt.value = this.vignetteAmount + impact * this.brightenMultipler * -0.0005;
        }
    }

    setBackground = () => {
        const url2 = "https://images.pexels.com/photos/240040/pexels-photo-240040.jpeg";
        const url = "./img/solar.jpeg";
        const textureLoader = new THREE.TextureLoader();
        textureLoader.crossOrigin = "";
        textureLoader.load(url, (texture) => {
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipMaps = false;

            this.material = new THREE.ShaderMaterial( {
                uniforms: { 
                    texture1: {type: "t", value: texture }, 
                    vignette_amt: {value: 0.3}, 
                    should_vignette: {value: true}, 
                    should_mirror: {value: true} 
                },
                vertexShader,
                fragmentShader,
            });
            
            this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
            this.scene.add(this.mesh);
            
            this.folder.add(this.material.uniforms.should_vignette, "value", {name: "Enable Vignette"});
            this.folder.add(this, "brightenToAudio");
            this.folder.add(this, "brightenMultipler");           
            this.folder.add(this, "vignetteAmount").onChange(() => this.material.uniforms.value = this.vignetteAmount);
            this.folder.add(this.material.uniforms.should_mirror, "value", {name: "Mirror image"});
            this.impactAnalyser = new ImpactAnalyser(this.folder);
            this.impactAnalyser.endBin = 60;
            this.impactAnalyser.deltaDecay = 20;
            this.folder.updateDisplay();
        })
    }
}