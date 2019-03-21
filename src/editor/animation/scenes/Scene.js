
import getItemClassFromText from '../items'
import OrbitControls from '../controls/OrbitControls';

export default class Scene {
    constructor(gui, resolution, remove, moveScene) {
        this.__moveScene = moveScene;
        this.remove = remove;   
        this.resolution = resolution;     
        this.modalRef = gui.modalRef;
        this.items = [];
        this.gui = gui;
        this.setUpGui();
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
        this.cameraFolder.add(this.controls, "enabled").name("Controls enabled");
    }
    setUpGui = (before =  null) => {
        const gui = this.gui;
        this.folder = gui.addFolder(this.TYPE  + " scene", true, true, before);
        this.folder.upFunction = () => this.__moveScene({up: true, scene: this});
        this.folder.downFunction = () => this.__moveScene({up: false, scene: this});
        this.overviewFolder = gui.__root.__folders["Overview"];
        this.itemsFolder = this.folder.addFolder("Items");
        this.itemsFolder.add(this, "addItem");
        this.cameraFolder = this.folder.addFolder("Camera");
        this.settingsFolder = this.folder.addFolder("Settings");
        this.cameraFolder.add(this, "resetCamera");
        this.settingsFolder.add(this, "removeMe").name("Remove this scene");
    }

    removeMe = () => {
        // TODO fix better handling of removing scenes regarding undo/redo
        /*
        while(this.items.length > 0) {
            this.items[0].dispose();
            if(this.TYPE !== "canvas")
                this.scene.remove(this.items[0].mesh);
            this.items.pop();
        }*/
        
        this.remove(this);
    }

    removeItem = (item) => {
        const index = this.items.findIndex(e => e === item);

        console.log(this.TYPE, this.items[index].mesh, index)
        if(this.TYPE !== "canvas")
            this.scene.remove(this.items[index].mesh);
        this.items.splice(index, 1);

        const it = {func: this.undoRemoveItem, args: item, type: "action"}
        this.folder.getRoot().addUndoItem(it);
    }

    undoRemoveItem = (item) => {
        this.items.push(item);
        item.__setUpFolder();
        if(item.type !== "canvas")
            this.scene.add(item.mesh);
    }

    stop = () => {
        this.items.forEach(item => {
            item.stop();
        })
    }

    addItemFromText = (name, fromTemplate=true) => {
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
            
            const itemClass = getItemClassFromText(this.TYPE, name);
            const item = new itemClass(info);
            this.items.push(item);

            if(!fromTemplate) {
                const it = {func: this.removeItem, args: item, type: "action"}
                this.folder.getRoot().addUndoItem(it);
            }
          
            return item;
        }
    }


    addItem = () => {
        const ref = this.itemsFolder.__root.modalRef;
        ref.toggleModal(this.MODAL_REF_NR).then((text) => this.addItemFromText(text, false));
    }

    update = (time, audioData, shouldIncrement) => {
        if(shouldIncrement) {
            this.items.forEach(item => item.update(time, audioData));
        }
    }
}