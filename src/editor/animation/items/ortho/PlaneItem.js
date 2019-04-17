
import * as THREE from 'three'
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'
import { addOrthoMeshControls } from 'editor/util/AddMeshControls';

import BaseItem from '../BaseItem'
import addMaterialControls from '../../materials/MaterialControls';



export default class PlaneItem extends BaseItem {

    constructor(info) {
        super(info);
        this.name = "Plane";
        this.gui = info.gui;
        this.scene = info.scene;
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.Material());
        this.scene.add(this.mesh);        
    }

    update = (time, audioData) => {
        if(this.impactAnalyser) {
            const impact = this.impactAnalyser.analyse(audioData.frequencyData) ;
            this.material.update(impact);
        }
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        this.impactAnalyser = new ImpactAnalyser(folder);
        this.impactAnalyser.endBin = 60;
        this.impactAnalyser.deltaDecay = 20;
        addOrthoMeshControls(this, this.mesh, folder);
        addMaterialControls(this, folder);
        folder.updateDisplay();
        return this.__addFolder(folder);
    }
}