
import * as THREE from 'three';
import items from '../items'

export default class CanvasScene {
    constructor(gui, resolution) {        
        this.canvas = document.createElement("canvas",);
        this.canvas.width = resolution.width;
        this.canvas.height = resolution.height;
        this.ctx = this.canvas.getContext("2d");
        this.resolution = resolution;
        this.items = [];
        this.setUpGui(gui);

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10 );
        this.camera.position.z = 1.0;
        this.tex = new THREE.Texture(this.canvas);
        this.tex.minFilter = THREE.LinearFilter;
        this.tex.magFilter = THREE.LinearFilter;
        this.tex.generateMipmaps = false;

        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2,2), new THREE.MeshBasicMaterial({map: this.tex, transparent: true}));
        
        this.scene.add(this.mesh);
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
            canvas: this.canvas,
            ctx: this.ctx
        };


        const item = new items[name](info)
        this.items.push(item);
        return item;
    }

    addItem = () => {
        this.gui.__root.onParentSelect = this.addItemFromText;
        this.gui.__root.modalRef.toggleModal(2);
    }

    update = (time, audioData) => {
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.items.forEach(item =>  {
            this.ctx.save();
            item.update(time, audioData)
            this.ctx.restore();
        });
        this.tex.needsUpdate = true;
    }
}