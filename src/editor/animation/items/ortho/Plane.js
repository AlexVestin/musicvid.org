import * as THREE from "three";
import BaseItem from '../BaseItem'

export default class Plane extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Plane";
        this.__setUpFolder();
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2,2), new THREE.MeshBasicMaterial({color: "red"}));
        this.color = 0xFF0000;
        this.folder.addColor(this, "color").onChange(this.onColorChange);
        info.scene.add(this.mesh);
    }

    onColorChange = (value) => {
        this.mesh.material.color = new THREE.Color(value);
    }


    update = (time, audioData) => {
        
    };
}
