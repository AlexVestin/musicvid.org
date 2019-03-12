
import * as THREE from 'three';
import getItemClassFromText from '../items'

export default class Scene3DOrtho {
    constructor(gui, resolution, remove) {
        this.remove = remove;        
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 10 );
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

    removeMe = () => {
        while(this.items.length > 0) {
            this.items[0].dispose();
            this.items.pop();
        }
        this.remove(this);
    }

    setUpGui = (gui) => {
        this.gui = gui;
        this.folder = gui.addFolder("Scene3D Ortho");
        this.overviewFolder = gui.__root.__folders["Overview"];
        this.itemsFolder = this.folder.addFolder("Items");
        this.itemsFolder.add(this, "addItem");
        this.cameraFolder = this.folder.addFolder("Camera");
        this.settingsFolder = this.folder.addFolder("Settings");
        this.settingsFolder.add(this, "removeMe");
    }

    removeItem = (item) => {
        const index = this.items.findIndex(e => e === item);
        this.scene.remove(this.items[index].mesh);
        this.items.splice(index, 1);
    }

    addItemFromText = (name) => {
        if(name) {
            const info = {
                gui: this.itemsFolder,
                overviewFolder: this.overviewFolder,
                width: this.resolution.width,
                height: this.resolution.height,
                scene: this.scene,
                camera: this.camera,
                remove: this.removeItem
            };
    
    
            const itemClass = getItemClassFromText("ortho", name);
            const item = new itemClass(info);
            this.items.push(item);
            return item;
        }
     
    }

    addItem = () => {
        const ref = this.itemsFolder.__root.modalRef;
        ref.toggleModal(6).then(this.addItemFromText);
    }

    update = (time, audioData, shouldIncrement) => {
        if(shouldIncrement) {
            this.items.forEach(item => item.update(time, audioData));
        }
    }
}