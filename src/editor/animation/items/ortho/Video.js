import * as THREE from "three";
import BaseItem from '../BaseItem'

export default class Plane extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Plane";
        this.setUpFolder();
        
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2,2), new THREE.MeshBasicMaterial({color: "red"}));
        this.color = 0xFF0000;
        this.folder.addColor(this, "color").onChange(this.onColorChange);
        info.scene.add(this.mesh);
    }

    onColorChange = (value) => {
        this.mesh.material.color = new THREE.Color(value);
    }

    setUpGUI(gui, name) {
        const folder = gui.addFolder(name);
        folder.add(this, "addVideo");
    }

    addVideo = () => {
        
        const tex = new THREE.VideoTexture();
    }


    update = (time, audioData) => {
        
    };
}
