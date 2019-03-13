
import * as THREE from 'three';
import getItemClassFromText from '../items'
import OrbitControls from '../controls/OrbitControls';

export default class Scene3DPerspective {
    constructor(gui, resolution, remove) {
        this.remove = remove;   
        this.resolution = resolution;     
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, resolution.width / resolution.height, 0.1, 10000 );
        this.camera.position.z = 200;
        
        this.frustum = new THREE.Frustum();
        
        this.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(
            this.camera.projectionMatrix, this.camera.matrixWorldInverse
        ));

        this.modalRef = gui.modalRef;
        this.items = [];
        this.gui = gui;
        this.setUpControls();
        this.setUpGui(gui);
    }

    updateCamera = () => {
        this.controls.dispose();
        this.setUpControls();
    }

    resetCamera =  () => {
        this.controls.reset();
    }
    
    setUpControls = () => {
        this.controls = new OrbitControls(this.camera, this.gui.__root.canvasMountRef);
        this.controls.enabled = false;
    }
    setUpGui = (gui) => {
        
        this.folder = gui.addFolder("Scene3D Perspective");
        this.overviewFolder = gui.__root.__folders["Overview"];
        this.itemsFolder = this.folder.addFolder("Items");
        this.itemsFolder.add(this, "addItem");
        this.cameraFolder = this.folder.addFolder("Camera");
        this.settingsFolder = this.folder.addFolder("Settings");
        this.settingsFolder.add(this, "resetCamera");
        this.settingsFolder.add(this.controls, "enabled").name("Controls enabled");
        this.settingsFolder.add(this, "removeMe").name("Remove this scene");
    }

    removeMe = () => {
        while(this.items.length > 0) {
            this.items[0].dispose();
            this.scene.remove(this.items[0].mesh);
            this.items.pop();
        }

        this.remove(this);
    }

    removeItem = (item) => {
        const index = this.items.findIndex(e => e === item);
        this.scene.remove(this.items[index].mesh);
        this.items.splice(index, 1);
    }

    stop = () => {
        this.items.forEach(item => {
            item.stop();
        })
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
            
            const itemClass = getItemClassFromText("perspective", name);
            const item = new itemClass(info);
            this.items.push(item);
            return item;
        }
        
    }

    addItem = () => {
        const ref = this.itemsFolder.__root.modalRef;
        ref.toggleModal(7).then(this.addItemFromText);
    }

    update = (time, audioData, shouldIncrement) => {
        if(shouldIncrement) {
            this.items.forEach(item => item.update(time, audioData));
        }
    }
}