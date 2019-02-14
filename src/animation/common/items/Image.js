
import * as THREE from 'three'
import loadImage from '../../../util/ImageLoader'
import BaseItem from './BaseItem'

export default class Image extends BaseItem{

    constructor(info) {
        super();
        this.gui = info.gui;
        this.scene = info.scene;

        this.material = new THREE.MeshBasicMaterial({transparent: true});
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
        this.scene.add(this.mesh);

        const url = "./img/solar.jpeg";
        this.fromURL(url);
        this.folder = this.setUpGUI(this.gui, "Background");
    }

    changeImage = () => {
        this.folder.__root.modalRef.onParentSelect = this.loadNewBackground;
        this.folder.__root.modalRef.toggleModal(3);
    }
    
    update = (time, audioData) => {
        if(this.brightenToAudio && this.impactAnalyser) {
            const impact = this.impactAnalyser.analyseImpact(audioData.frequencyData) ;
            this.material.uniforms.vignette_amt.value = this.vignetteAmount + impact * this.brightenMultipler * -0.0005;
        }
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "changeImage");
        folder.updateDisplay();
        return folder;
    }

    setBackground = (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipMaps = false;
        this.material.map = texture;
        this.material.needsUpdate = true;
    }

    loadNewBackground = (selected) => {
        loadImage(selected, this.setBackground);
        
    }

   
}