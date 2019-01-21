import * as THREE from "three";

export default class Bars {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.createBars(64);
    }

    createBars = nrOfBars => {
        for (var i = 0; i < nrOfBars; i++) {
            var geometry = new THREE.BoxGeometry(1, 1, 1);
            var material = new THREE.MeshBasicMaterial({ color: "red" });
            var cube = new THREE.Mesh(geometry, material);

            cube.position.x = i * 2 - nrOfBars;
            cube.position.y = 0;
            this.group.add(cube);
        }

        this.scene.add(this.group);
    };

    update = (time, audioData, alpha) => {
        const bins = audioData.frequencyData;
        const divider = 8000;
        this.group.children.forEach((e, i) => {
            e.scale.set(1, bins[i] / divider, 1);
            e.position.y = 0 + bins[i] / divider / 2;
        });
    };
}
