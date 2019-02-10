
import * as THREE from 'three';
import items from '../items'
import OrbitControls from '../controls/OrbitControls';

export default class Scene3DPerspective {
    constructor(gui, aspect) {        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 10000 );
        this.camera.position.z = 200;
        
        this.frustum = new THREE.Frustum();
        
        this.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(
            this.camera.projectionMatrix, this.camera.matrixWorldInverse
        ));

        this.modalRef = gui.modalRef;
        this.items = [];
        this.setUpGui(gui);
        this.setUpControls();
        this.camera.position.x = 1415;
        this.camera.position.y = 1644;
        this.camera.position.z = -2556;
        this.camera.updateMatrixWorld();


       
    }
    
    setUpControls = () => {
        this.controls = new OrbitControls(this.camera, this.gui.__root.canvasMountRef)
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
            width: this.gui.__root.canvasMountRef.width,
            height: this.gui.__root.canvasMountRef.height,
            scene: this.scene,
            camera: this.camera
        };
        
        const item = new items[name](info)
        this.items.push(item);
        return item;
    }

    addItem = () => {
        this.modalRef.onParentSelect = this.addItemFromText;
        this.gui.modalRef.toggleModal(2);
    }

    update = (time, audioData) => {
        this.items.forEach(item => item.update(time, audioData));
        console.log(this.camera.position)
    }
}