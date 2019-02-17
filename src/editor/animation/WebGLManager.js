

import * as THREE from 'three'


export default class WebGLManager {

    constructor(gui, resolution, sound) {
        
        this.canvasMountRef = gui.canvasMountRef;
        this.modalRef = gui.modalRef;
        this.gui = gui;
        this.width = resolution.width;
        this.height = resolution.height;
        this.aspect = this.width / this.height;
        this.audioDuration = sound.audioDuration;  
        this.audio = sound;
        this.scenes = [];
        this.setUpRenderers();
        this.setUpScene();
    }

    setClear = () => {
        this.renderer.setClearColor(this.clearColor);
        this.renderer.setClearAlpha(this.clearAlpha);
    }

    setFFTSize = (size) => {
        this.audio.setFFTSize(size);
        this.gui.__folders["Audio"].updateDisplay();
    }

    setUpRenderers = () => {
        // Set up internal canvas to keep canvas size on screen consistent
        this.internalCanvas = document.createElement("canvas");
        this.internalCanvas.width = this.width;
        this.internalCanvas.height = this.height;
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: this.internalCanvas});
        this.renderer.autoClear = false;
        this.externalCtx = this.canvasMountRef.getContext("2d");
        this.renderer.setClearColor('#000000');
        this.renderer.setSize(this.width, this.height);

        this.clearColor = "#000000";
        this.clearAlpha = 1.0;

        this.gui.__folders["Settings"].addColor(this, "clearColor").onChange(this.setClear);
        this.gui.__folders["Settings"].add(this, "clearAlpha", 0, 1, 0.001).onChange(this.setClear);

    }

    stop = () => {
        this.scenes.forEach(scene => {
            scene.stop();
        })
        this.renderer.clear();
        console.log("stop")
    }

    setUpScene() {
        console.log("Implement this");
    }

    update = (time, audioData) => {
        this.renderer.clear();
        this.scenes.forEach(scene => {
            scene.update(time, audioData);
            this.renderer.render(scene.scene, scene.camera);
        });        

        this.externalCtx.drawImage(this.internalCanvas, 0, 0, this.canvasMountRef.width, this.canvasMountRef.height);
    }

}