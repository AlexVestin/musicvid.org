
import * as THREE from 'three';
import items from '../items'

export default class Scene3DOrtho {
    constructor(gui) {        
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 1000 );
        this.camera.position.z = 1;
        this.modalRef = gui.modalRef;
        this.items = [];
        this.setUpGui(gui);
    }

    setUpGui = (gui) => {
        this.gui = gui;
        this.folder = gui.addFolder("Scene3D Ortho");
        this.itemsFolder = this.folder.addFolder("Items");
        this.itemsFolder.add(this, "addItem");
        this.cameraFolder = this.folder.addFolder("Camera");
        this.settingsFolder = this.folder.addFolder("Settings");
    }

    addItemFromText = (name) => {
        const info = {
            gui: this.itemsFolder,
            width: this.gui.canvasMountRef.width,
            height: this.gui.canvasMountRef.height,
            scene: this.scene,
            camera: this.camera
        };
        
        this.items.push(new items[name](info));
    }

    addItem = () => {
        this.modalRef.onParentSelect = this.addItemFromText;
        this.gui.modalRef.toggleModal(2);
    }

    update = (time, audioData) => {
        this.items.forEach(item => item.update(time, audioData));
    }
}