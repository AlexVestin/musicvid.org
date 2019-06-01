
import getItemClassFromText from '../items'
import OrbitControls from '../controls/OrbitControls';
import SerializableObject from '../SerializableObject';
import serialize from '../Serialize'

export default class Scene extends SerializableObject {
    constructor(gui, resolution, remove, moveScene) {
        super();
        this.__moveScene = moveScene;
        this.remove = remove;   
        this.resolution = resolution;  
        this.isScene = true;   

        this.items = [];
        if(gui) {
            this.modalRef = gui.modalRef;
            this.gui = gui;
            this.__gui = gui;
            this.setUpGui();
        }
    }

    play = (t) => {
        this.items.forEach(item => item.play(t));
    }

    seekTime = (t) => {
        this.items.forEach(item => item.seekTime(t));
    }

    addItems = (items) => {
        items.forEach(item => {
            const i = this.addItemFromText(item.__itemName);
            i.__setControllerValues(item.controllers);
            i.__automations = item.__automations;
            i.setFolderName(i.name);
        });         
    }

    updateCamera = () => {
        const enabled = this.controls.enabled;
        this.controls.dispose();
        this.controls = new OrbitControls(this.camera, this.gui.__root.canvasMountRef);
        this.controls.handleMouseUp = this.handleMouseUp;
        this.controls.enabled = enabled;
    }

    resetCamera =  () => {
        this.controls.reset();
        this.cameraFolder.updateDisplay();
    }

    updateSettings = () => {

    }

    undoCameraMovement = (matrix) => {
        const { camera } = this;
        camera.matrix.fromArray(matrix);
        camera.matrix.decompose(camera.position, camera.quaternion, camera.scale); 
        this.lastCameraArray = this.camera.matrix.toArray();
        this.cameraFolder.updateDisplay();
    }


    handleMouseUp = () => {
        this.gui.getRoot().addUndoItem({type: "action", func: this.undoCameraMovement, args: this.lastCameraArray});
        this.lastCameraArray = this.camera.matrix.toArray();
        this.cameraFolder.updateDisplay();
    }

    updateCameraMatrix = () => {
        this.camera.updateMatrixWorld();
        this.camera.updateProjectionMatrix();

        if(this.controls.enabled) {
            this.controls.update();
        }
    }
    
    setUpControls = () => {
        this.controls = new OrbitControls(this.camera, this.gui.__root.canvasMountRef);
        this.controls.enabled = false;
        this.cameraFolder.add(this.controls, "enabled").name("Orbitcontrols enabled");
        this.controls.handleMouseUp = this.handleMouseUp;
        this.lastCameraArray = this.camera.matrix.toArray();

        const camOpts = { min: -10, max: 10, step: 0.0001, path: "camera-position"};
        this.cameraXController = this.addController(this.cameraFolder, this.camera.position, "x", camOpts).name("positionX").onChange(this.updateCameraMatrix);
        this.cameraYController = this.addController(this.cameraFolder, this.camera.position, "y", camOpts).name("positionY").onChange(this.updateCameraMatrix);
        this.cameraZController = this.addController(this.cameraFolder, this.camera.position, "z", camOpts).name("positionZ").onChange(this.updateCameraMatrix);

        const rotOpts = { min: -Math.PI, max: Math.PI, step: 0.0001, path: "camera-rotation"};
        this.addController(this.cameraFolder, this.camera.rotation, "x", rotOpts).name("rotationX").onChange(this.updateCameraMatrix);
        this.addController(this.cameraFolder, this.camera.rotation, "y", rotOpts).name("rotationY").onChange(this.updateCameraMatrix);
        this.addController(this.cameraFolder, this.camera.rotation, "z", rotOpts).name("rotationZ").onChange(this.updateCameraMatrix);
        this.addController(this.cameraFolder, this.camera, "zoom", {min: -10,  max: 10, step: 0.001, path: "camera-zoom"}).onChange(this.updateCameraMatrix);
        this.folder.updateDisplay();
    }

    setUpPassConfigs = () => {
        if(this.settingsFolder) {
            this.settingsFolder.add(this.pass, "clear");
            this.settingsFolder.add(this.pass, "clearDepth");
            this.settingsFolder.add(this.pass, "needsSwap");
            this.settingsFolder.add(this.pass, "enabled");

            this.settingsFolder.add(this.pass, "renderToScreenInternal").name("Skip fx and render to screen");
        }
       
    }

    setUpGui = (before =  null) => {
        const gui = this.gui;
        this.folder = gui.addFolder(this.__id, true, true, before);
        this.folder.upFunction = () => this.__moveScene({up: true, scene: this});
        this.folder.downFunction = () => this.__moveScene({up: false, scene: this});
        this.itemsFolder = this.folder.addFolder("Items");
        
        this.itemsFolder.add(this, "addItem");
        this.cameraFolder = this.folder.addFolder("Camera");
        this.settingsFolder = this.folder.addFolder("Settings");
        this.addController(this.settingsFolder, this.folder, "name").name("Scene name")
        this.addController(this.cameraFolder, this, "resetCamera");
        this.settingsFolder.add(this, "removeMe").name("Remove this scene");
        
        this.items.forEach(item =>  {
            item.__gui = this.itemsFolder;
            item.__setUpFolder();
        });
    }

    __serialize = () => {
        let sceneConfig = {
            __settings: serialize(this),
            __passSettings: serialize(this.pass),
            __automations: this.__automations,
            __items: [],
            __controllers: this.__serializeControllers()
        }
        
        this.items.forEach(item => {
            sceneConfig.__items.push(item.serialize());
        });
        sceneConfig.camera = this.camera.matrix.toArray()
        sceneConfig.controlsEnabled = this.controls.enabled;

        return sceneConfig;
    }

    removeMe = () => {
        this.items.forEach((item) => {
            this.removeItem({item});
        });
        this.items = [];
        this.scene.dispose();

        this.remove({scene: this});
    }

    removeItem = (args) => {
        const { item } = args;
        const index = this.items.findIndex(e => e === item);
        if(this.type !== "canvas" && this.type !== "pixi"){
            this.scene.remove(item.mesh);
        }

        item.dispose();
        Object.keys(item.__controllers).forEach((key) => {
            item.__controllers[key].__subControllers.forEach((folder) => {
                try {
                    folder.parent.remove(folder);
                }catch(err) {
                    console.log("Could not remove controller from overview")
                }

            });
            item.__controllers[key].__subControllers = [];
        })
        
        item.folder.parent.removeFolder(item.folder);
        delete item.folder.parent.__folders[item.__id];
        this.items.splice(index, 1);
    }

    stop = () => {
        this.items.forEach(item => {
            item.stop();
        })
    }

    getInfoObject = () => {
        if(this.type === "canvas") {
            
        }
    }

    addItemFromText = (name, fromTemplate=true) => {
        if(name) {
            let info = {
                gui: this.itemsFolder,
                type: this.type,
                width: this.resolution.width,
                height: this.resolution.height,
                scene: this.scene,
                camera: this.camera,
                remove: this.removeItem
            };

            if(this.type  === "canvas") {
                info = {...info, ctx: this.ctx, canvas: this.canvas};
            }else if(this.type === "pixi") {
                info = {...info,  canvas: this.canvas, container: this.container, graphics: this.graphics};
            }


            
            const itemClass = getItemClassFromText(this.type, name);
            const item = new itemClass(info);
            item.__itemName = name;
            this.items.push(item);

            if(!fromTemplate) {
                const it = {func: this.removeItem, args: { item, undoAction: true} , type: "action"}
                this.folder.getRoot().addUndoItem(it);
            }
          
            return item;
        }
    }


    addItem = () => {
        const ref = this.itemsFolder.__root.modalRef;
        ref.toggleModal(this.MODAL_REF_NR).then((text) => this.addItemFromText(text, false));
    }

    render = (renderer) => {
        renderer.render(this.scene, this.camera);
    }

    update = (time, audioData, shouldIncrement) => {
        this.applyAutomations(shouldIncrement);
        if(shouldIncrement) {
            this.items.forEach(item =>  {
                item.mesh.visible = (item.__startTime <= time && item.__endTime >= time);
                item.applyAutomations(shouldIncrement);
                item.update(time, audioData)  
            });
        }
    }
}