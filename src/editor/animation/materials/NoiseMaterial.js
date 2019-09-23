
import * as THREE from 'three';
import ShaderToyMaterial from 'editor/animation/util/ShaderToyMaterial'
import fragShader from '../shaders/licensed/Noise'
import ImpactAnalyser from '../audio/ImpactAnalyser'
import { loadImageTextureFromChoice } from 'editor/animation/util/ImageLoader';
import addNoise from './AddNoise'

export default class NoiseMaterial extends ShaderToyMaterial {
    constructor(item) {
        super(
            fragShader,
            {
                uniforms: { 
                    iChannel0: {value: null, type: "t"},
                    iResolution: {value: new THREE.Vector2(item.width, item.height)},
                    iTime: {value: 0.0},
                    mult: {value: 4.0},
                    green: {value: .1},
                    red: {value: .2},
                    blue: {value: .4},
                    textureZoom: {value: 4}
                }
            }
        )

        this.__objectsToSerialize = ["uniforms"];

        this.name = "Noise Animation";
        this.texLoader = new THREE.TextureLoader(); 
        this.prevFile = "noisy2.png";
        loadImageTextureFromChoice("./img/noise/" + this.prevFile, this.setTexture);     
        
        this.time = 0;
        this.lastTime = 0;
        this.amplitude = 0.1;
        this.baseSpeed = 0.1;
        this.noises = [];
        this.width = item.width;
        this.height = item.height;


        this.red = 0.1;
        this.green = 0.2;
        this.blue = 0.4;

        //GUi
       
        
    
        item.__attribution = {
            showAttribution: true,
            name:"Noise animation - Electric",
            authors: [
                {
                    name: "nmz (@stormoid)", 
                    social1: {type: "website", url: "http://stormoid.com/"},
                    social2: {type: "twitter", url: "https://twitter.com/stormoid"},
                },
            ],
            projectUrl: "https://www.shadertoy.com/view/ldlXRS",
            description: "",
            license: item.LICENSE.REQUIRE_ATTRIBUTION,
            changeDisclaimer: true,
            imageUrl: "img/templates/Noise.png"
        }

        this.path = "material";
        this.__item = item;
    }
    setTexture = (tex) => {
        tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
        tex.repeat.set(50, 1);
        this.uniforms.iChannel0.value  =tex;
        this.needsUpdate = true;
    }

    undoUpdateTexture = (path) => {
        loadImageTextureFromChoice("./img/noise/" + path, this.setTexture);
    }

    updateTexture = (path, undoAction = false) => {
        loadImageTextureFromChoice("./img/noise/" + path, this.setTexture)
        this.prevFile = path;
    }
    __setUpGUI = (folder) => {
        const i = this.__item;
        i.addController(folder, this, "baseSpeed", -10, 10, 0.01);
        i.addController(folder, this, "amplitude", -3, 3, 0.001);
        i.addController(folder, this, "width").onChange(() => this.uniforms.iResolution.value = new THREE.Vector2(this.width, this.height))
        i.addController(folder, this, "height").onChange(() => this.uniforms.iResolution.value = new THREE.Vector2(this.width, this.height))
        i.addController(folder, this.uniforms.textureZoom, "value", {min: 0, max: 40, path:"TextureZoom"}).name("Texture zoom");
        i.addController(folder,this.uniforms.red, "value", {min: 0, max: 1, step: 0.01, path: "red"}).name("Red");
        i.addController(folder,this.uniforms.green, "value", 0, 1, 0.01).name("Green");
        i.addController(folder,this.uniforms.blue, "value", 0, 1, 0.01).name("Blue");
        addNoise(folder, this.updateTexture, "noisy2.png", i);

        this.textureZoom = 4;
        this.impactAnalyser = new ImpactAnalyser(folder, i);
        this.impactAnalyser.endBin = 60;
        this.impactAnalyser.deltaDecay = 20;
        this.folder = folder;
        return folder;
    }

    stop = () => {
        this.time = 0;
        this.lastTime = 0;
    }

    updateMaterial = (time, dt, audioData) => {
        this.uniforms.iTime.value = time;
        if(this.impactAnalyser) {
            const impact = this.impactAnalyser.analyse(audioData.frequencyData) ;
            this.time += this.baseSpeed * 0.01 + dt * impact * this.amplitude / 10; 
            this.uniforms.iTime.value = this.time ;
            this.lastTime = time;
        }
    }
}