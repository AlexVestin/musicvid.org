import * as THREE from "three";
import SpectrumAnalyser from '../audio/analyser'
export default class Bars {
    constructor(info) {
        this.folder = info.gui.addFolder("Spectrum bars");

        this.analyser = new SpectrumAnalyser(this.folder.addFolder("Spectrum Analyse Settings"));
        this.scene = info.scene;
        this.group = new THREE.Group();
        this.createBars(64);

        this.amplitude = 10;
        this.folder.add(this, "amplitude");

        this.color = 0xFF0000;
        this.folder.addColor(this, "color").onChange(this.onColorChange);
    }

    onColorChange = (value) => {
        this.group.children.forEach(bar => { bar.material.color = new THREE.Color(value) });
    }

    createBars = nrOfBars => {
        for (var i = 0; i < nrOfBars; i++) {
            let geometry = new THREE.BoxGeometry(1, 1, 1);
            let material = new THREE.MeshBasicMaterial({ color: "red" });
            let cube = new THREE.Mesh(geometry, material);

            cube.position.x = i * 2 - nrOfBars;
            cube.position.y = 0;
            this.group.add(cube);
        }

        this.scene.add(this.group);
    };

    update = (time, audioData, alpha) => {
        const bins = this.analyser.getTransformedSpectrum(audioData.frequencyData);
        const divider = 100 / this.amplitude;

        this.group.children.forEach((e, i) => {
            e.scale.set(1, bins[i] / divider, 1);
            e.position.y = 0 + bins[i] / divider / 2;
        });
    };
}
