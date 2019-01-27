import * as THREE from "three";

export default class Box {
    constructor(info) {
        this.folder = info.gui.addFolder("Plane");
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
