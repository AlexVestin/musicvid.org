
import * as THREE from 'three';
import items from '../items'

export default class Scene3DOrtho {
    constructor(gui, aspect) {        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 10000 );
        this.camera.position.z = 200;
        
        this.frustum = new THREE.Frustum();
        this.camera.updateMatrixWorld();
        this.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(
            this.camera.projectionMatrix, this.camera.matrixWorldInverse
        ));

        this.modalRef = gui.modalRef;
        this.items = [];
        this.setUpGui(gui);
    }
    

    setUpGui = (gui) => {
        this.gui = gui;
        this.folder = gui.addFolder("Scene3D Perspective");
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