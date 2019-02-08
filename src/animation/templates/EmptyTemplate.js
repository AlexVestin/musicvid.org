import * as THREE from 'three'
import Scene3DOrthoGraphic from '../common/scenes/Scene3DOrthoGraphic'
import Scene3DPerspective from '../common/scenes/Scene3DPerspective'
import Scene2D from '../common/scenes/Scene2D'


export default class Manager {

    constructor(gui, resolution) {
        this.canvasMountRef = gui.canvasMountRef;
        this.modalRef = gui.modalRef;
        this.gui = gui;
        this.width = resolution.width;
        this.height = resolution.height;
        
        this.scenes = [];
        this.setUpRenderers();
        this.setUpScene();
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
    }

    setUpScene = () => {
        this.gui.__folders["Layers"].modalRef = this.gui.modalRef;
        this.gui.__folders["Layers"].canvasMountRef = this.gui.canvasMountRef;

        this.scenes.push(new Scene3DOrthoGraphic(this.gui.__folders["Layers"], this.width / this.height));
        this.scenes.push(new Scene3DPerspective(this.gui.__folders["Layers"], this.width / this.height));
        this.scenes.push(new Scene3DOrthoGraphic(this.gui.__folders["Layers"], this.width / this.height));
        
        const it1 = this.scenes[0].addItemFromText("StarField");
        //const it2 = this.scenes[1].addItemFromText("Particles");
        const it3 = this.scenes[2].addItemFromText("JSNation");

        it1.setUpGUI(this.gui.__folders["Overview"], "StarField");
        //it2.setUpGUI(this.gui.__folders["Overview"], "Particles");
        it3.setUpGUI(this.gui.__folders["Overview"], "JSNation");

        this.gui.__folders["Overview"].onResize();
        
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