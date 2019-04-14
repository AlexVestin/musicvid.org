
import * as THREE from 'three'
import {loadImageTexture} from 'editor/util/ImageLoader'
import BaseItem from '../BaseItem'
import { addOrthoMeshControls } from 'editor/util/AddMeshControls'

export default class Image extends BaseItem{

    constructor(info) {
        super(info);
        this.name = "Image";
        this.gui = info.gui;
        this.scene = info.scene;

        this.material = new THREE.MeshBasicMaterial({transparent: true});
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
        this.scene.add(this.mesh);

        const url = "./img/solar.jpeg";
        this.loadNewBackground(url);
        this.prevFile = url;
        this.__setUpFolder();
    }

    async changeImage() {
        loadImageTexture(this, "setBackground")
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
        addOrthoMeshControls(this, this.mesh, folder);
        folder.updateDisplay();
        return this.__addFolder(folder);
    }

    setBackground = (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipMaps = false;
        this.material.map = texture;
        this.material.needsUpdate = true;
    }
}