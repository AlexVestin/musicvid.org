
import * as THREE from 'three';
import getItemClassFromText from '../items'
import OrbitControls from '../controls/OrbitControls';

export default class CanvasScene {
    constructor(gui, resolution, remove) {
        this.remove = remove;     
        this.canvas = document.createElement("canvas",);
        this.canvas.width = resolution.width;
        this.canvas.height = resolution.height;
        this.ctx = this.canvas.getContext("2d");
        this.resolution = resolution;
        this.items = [];
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 20 );
        this.camera.position.z = 1.0;
        this.tex = new THREE.Texture(this.canvas);
        this.tex.minFilter = THREE.LinearFilter;
        this.tex.magFilter = THREE.LinearFilter;
        this.tex.generateMipmaps = false;

        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2,2), new THREE.MeshBasicMaterial({map: this.tex, transparent: true}));
        
        this.scene.add(this.mesh);

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

    stop = () => {
        this.items.forEach(item => {
            item.stop();
        })
    }

    setUpControls = () => {
        this.controls = new OrbitControls(this.camera, this.gui.__root.canvasMountRef)
        this.controls.enabled = false;
    }

    removeMe = () => {
        while(this.items.length > 0) {
            this.items[0].dispose();
            this.scene.remove(this.items[0].mesh);
            this.items.pop();
        }

        this.remove(this);
    }

    setUpGui = (gui) => {
        this.folder = gui.addFolder("Canvas Scene");
        this.overviewFolder = gui.__root.__folders["Overview"];
        this.itemsFolder = this.folder.addFolder("Items");
        this.itemsFolder.add(this, "addItem");


        this.cameraFolder = this.folder.addFolder("Camera");
        this.settingsFolder = this.folder.addFolder("Settings");
        this.settingsFolder.add(this, "resetCamera");
        this.settingsFolder.add(this.controls, "enabled").name("Controls enabled");
        this.settingsFolder.add(this, "removeMe").name("Remove this scene");
    }

    addItem = () => {
        const ref = this.itemsFolder.__root.modalRef;
        ref.toggleModal(5).then(this.addItemFromText);
    }

    removeItem = (item) => {
        const index = this.items.findIndex(e => e === item);
        this.items.splice(index, 1);
    }

    addItemFromText = (name) => {
        if(name) {
            const info = {
                gui: this.itemsFolder,
                overviewFolder: this.overviewFolder,
                width: this.resolution.width,
                height: this.resolution.height,
                canvas: this.canvas,
                ctx: this.ctx,
                remove: this.removeItem
            };
    
            const itemClass = getItemClassFromText("canvas", name);
            const item = new itemClass(info);
            this.items.push(item);
            return item;
        }
      
    }


    update = (time, audioData, shouldIncrement) => {
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

        this.items.forEach(item =>  {
            this.ctx.save();
            item.update(time, audioData, shouldIncrement);
            this.ctx.restore();
        });    
        
        this.tex.needsUpdate = true;
    }
}