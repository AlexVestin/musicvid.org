
import * as THREE from 'three';
import items from '../items'

export default class Scene3DOrtho {
    constructor(gui, resolution) {        
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 1000 );
        this.camera.position.z = 1;
        this.resolution = resolution;
        this.items = [];

        this.setUpGui(gui);
        
    }

    stop = () => {
        this.items.forEach(item => {
            item.stop();
        })
    }

    setUpGui = (gui) => {
        this.gui = gui;
        this.folder = gui.addFolder("Scene3D Ortho");
        this.itemsFolder = this.folder.addFolder("Items");
        this.cameraFolder = this.folder.addFolder("Camera");
        this.settingsFolder = this.folder.addFolder("Settings");
    }

    addItemFromText = (name) => {
        const info = {
            gui: this.itemsFolder,
            width: this.resolution.width,
            height: this.resolution.height,
            scene: this.scene,
            camera: this.camera,
        };


        console.log(name)
        const item = new items[name](info)
        this.items.push(item);
        return item;
    }

    addItem = () => {
        this.gui.__root.onParentSelect = this.addItemFromText;
        this.gui.__root.modalRef.toggleModal(2);
    }

    update = (time, audioData) => {
        this.items.forEach(item => item.update(time, audioData));
    }
}