
import * as THREE from 'three'
import ShaderToyMaterial from 'editor/util/ShaderToyMaterial'
import addNoise from 'editor/util/AddNoise'
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'
import Noise from '../../shaders'
import BaseItem from '../BaseItem'
import { loadImageTextureFromChoice } from '../../../util/ImageLoader';

export default class StarField extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Noise Animation";
        this.texLoader = new THREE.TextureLoader(); 
        this.prevFile = "noisy2.png";
        const tex = this.texLoader.load("./img/noise/noisy2.png");
        tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
        tex.repeat.set(50, 1);
        this.geo = new THREE.PlaneGeometry(2,2);
        this.mat = new ShaderToyMaterial(Noise, 
            {
                uniforms: { 
                    iChannel0: {value: tex, type: "t"},
                    iResolution: {value: new THREE.Vector2(info.width, info.height)},
                    iTime: {value: 0.0},
                    mult: {value: 4.0},
                    green: {value: .1},
                    red: {value: .2},
                    blue: {value: .4}
                }
            }
        );
        
        this.mesh = new THREE.Mesh(this.geo, this.mat);
        info.scene.add(this.mesh);
        this.time = 0;
        this.lastTime = 0;
        this.amplitude = 0.1;
        this.baseSpeed = 0.1;
        this.noises = []

        this.red = 0.1;
        this.green = 0.2;
        this.blue = 0.4;

        //GUi
        this.textureZoom = 4;
        this.__setUpFolder(info, this.name);
        this.impactAnalyser = new ImpactAnalyser(this.folder);
        this.impactAnalyser.endBin = 60;
        this.impactAnalyser.deltaDecay = 20;
        
        
        this.folder.updateDisplay();

        this.__attribution = {
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
            license: this.LICENSE.REQUIRE_ATTRIBUTION,
            changeDisclaimer: true,
            imageUrl: "img/templates/Noise.png"
        }
    }

    setTexture = (tex) => {
        tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
        tex.repeat.set(50, 1);
        this.mat.uniforms.iChannel0.value  =tex;
        this.mat.needsUpdate = true;
    }

    undoUpdateTexture = (path) => {
        loadImageTextureFromChoice("./img/noise/" + path, this.setTexture);
    }

    updateTexture = (path, undoAction = false) => {
        loadImageTextureFromChoice("./img/noise/" + path, this.setTexture)
        this.__addUndoAction(this.undoUpdateTexture, this.prevFile);
        this.prevFile = path;
    }
    setUpGUI = (gui, name) => {

        const folder = gui.addFolder(name);
        folder.add(this, "baseSpeed", -10, 10, 0.01);
        folder.add(this, "amplitude", -1, 1, 0.001);
        folder.add(this, "textureZoom", 0, 40).onChange(() => this.mat.uniforms.mult.value = this.textureZoom);
        folder.add(this, "red", 0, 1, 0.01).onChange(() => this.mat.uniforms.red.value = this.red);
        folder.add(this, "green", 0, 1, 0.01).onChange(() => this.mat.uniforms.green.value = this.green);
        folder.add(this, "blue", 0, 1, .01).onChange(() => this.mat.uniforms.blue.value = this.blue);


        addNoise(folder, this.updateTexture, "noisy2.png");
        return this.__addFolder(folder);
    }

    stop = () => {
        this.time = 0;
        this.lastTime = 0;
    }

    update = (time, audioData) => {
        
        this.mat.uniforms.iTime.value = time;
        if(this.impactAnalyser) {
            const impact = this.impactAnalyser.analyse(audioData.frequencyData) ;
            this.time += this.baseSpeed * 0.01 + (time  - this.lastTime) * impact * this.amplitude / 10; 
            this.mat.uniforms.iTime.value = this.time ;
            this.lastTime = time;
        }
    }
}