import * as THREE from 'three'
import Bars from './Bars'
export default class Manager {

    constructor(gui, canvasRef, resolution) {
        this.canvasMountRef = canvasRef;
        this.gui = gui;
        this.width = resolution.width;
        this.height = resolution.height;
        this.setUpRenderers();
        this.setUpScene();
    }

    setUpScene = () => {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, this.width/this.height, 0.1, 1000 );
        this.bars =  new Bars(this.gui, this.scene);

        this.camera.position.z = 60;
    }
    setUpRenderers = () => {
        // Set up internal canvas to keep canvas size on screen consistent
        this.internalCanvas = document.createElement("canvas");
        this.internalCanvas.width = this.width;
        this.internalCanvas.height = this.height;
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: this.internalCanvas});
        

        this.externalCtx = this.canvasMountRef.getContext("2d");
        this.renderer.setClearColor('#000000');
        this.renderer.setSize(this.width, this.height);
    }

    update = (time, audioData) => {
        this.bars.update(time, audioData);
        this.renderer.render( this.scene, this.camera );
        this.externalCtx.drawImage(this.internalCanvas, 0, 0, this.canvasMountRef.width, this.canvasMountRef.height);
    }

}