import getItemClassFromText from "../items";
import OrbitControls from "../controls/OrbitControls";
import SerializableObject from "../SerializableObject";
import serialize from "../Serialize";
import { Vector3 } from 'three'
export default class Scene extends SerializableObject {
    constructor(gui, resolution, remove, moveScene) {
        super();
        this.__moveScene = moveScene;
        this.remove = remove;
        this.resolution = resolution;
        this.isScene = true;

        this.items = [];
        if (gui) {
            this.modalRef = gui.modalRef;
            this.gui = gui;
            this.__gui = gui;
            this.setUpGui();
        }
    }

    play = t => {
        this.items.forEach(item => item.play(t));
    };

    seekTime = t => {
        this.items.forEach(item => item.seekTime(t));
    };

    addItems = items => {
        items.forEach(item => {
            const i = this.addItemFromText(item.__itemName);
            i.__setControllerValues(item.controllers, item.__automations);
            i.setFolderName(i.name);
        });
    };

    updateCamera = () => {
        const enabled = this.controls.enabled;
        this.controls.dispose();
        this.controls = new OrbitControls(
            this.camera,
            this.gui.__root.canvasMountRef
        );
        this.controls.handleMouseUp = this.handleMouseUp;
        this.controls.enabled = enabled;
    };

    resetCamera = () => {
        this.controls.reset();
        this.cameraFolder.updateDisplay();
    };

    updateSettings = () => {
        if(this.controls) {
            this.controls.update();
        }
    };

    undoCameraMovement = (matrix, controlConfigs) => {
        this.camera.matrix.fromArray(matrix);
        this.camera.matrix.decompose(
            this.camera.position,
            this.camera.quaternion,
            this.camera.scale
        );
        this.lastCameraArray = this.camera.matrix.toArray();
        this.cameraFolder.updateDisplay();

        if (controlConfigs) {
            this.controls.enabled = controlConfigs.enabled;
            const { x, y, z } = controlConfigs.target; 
            this.controls.target = new Vector3(x, y, z);

            this.controls.update();
        } else {
            this.controls.enabled = false;
            this.controls.update();
        }
     
        
    };

    handleMouseUp = () => {
        this.lastCameraArray = this.camera.matrix.toArray();
        this.cameraFolder.updateDisplay();
    };

    updateCameraMatrix = () => {
        this.camera.updateMatrixWorld();
        this.camera.updateProjectionMatrix();

        if (this.controls.enabled) {
            this.controls.update();
        }
    };

    setUpControls = () => {
        this.controls = new OrbitControls(
            this.camera,
            this.gui.__root.canvasMountRef
        );
        this.controls.enabled = false;
        this.cameraFolder
            .add(this.controls, "enabled")
            .name("Orbitcontrols enabled");
        this.controls.handleMouseUp = this.handleMouseUp;
        this.lastCameraArray = this.camera.matrix.toArray();

        const camOpts = {
            min: -10,
            max: 10,
            step: 0.0001,
            path: "camera-position"
        };
        this.cameraXController = this.addController(
            this.cameraFolder,
            this.camera.position,
            "x",
            camOpts
        )
            .name("positionX")
            .onChange(this.updateCameraMatrix);
        this.cameraYController = this.addController(
            this.cameraFolder,
            this.camera.position,
            "y",
            camOpts
        )
            .name("positionY")
            .onChange(this.updateCameraMatrix);
        this.cameraZController = this.addController(
            this.cameraFolder,
            this.camera.position,
            "z",
            camOpts
        )
            .name("positionZ")
            .onChange(this.updateCameraMatrix);

        const rotOpts = {
            min: -Math.PI,
            max: Math.PI,
            step: 0.0001,
            path: "camera-rotation"
        };
        this.addController(
            this.cameraFolder,
            this.camera.rotation,
            "x",
            rotOpts
        )
            .name("rotationX")
            .onChange(this.updateCameraMatrix);
        this.addController(
            this.cameraFolder,
            this.camera.rotation,
            "y",
            rotOpts
        )
            .name("rotationY")
            .onChange(this.updateCameraMatrix);
        this.addController(
            this.cameraFolder,
            this.camera.rotation,
            "z",
            rotOpts
        )
            .name("rotationZ")
            .onChange(this.updateCameraMatrix);
        this.addController(this.cameraFolder, this.camera, "zoom", {
            min: -10,
            max: 10,
            step: 0.001,
            path: "camera-zoom"
        }).onChange(this.updateCameraMatrix);
        this.folder.updateDisplay();
    };

    setUpPassConfigs = () => {
        if (this.settingsFolder) {
            this.settingsFolder.add(this.pass, "clear");
            this.settingsFolder.add(this.pass, "clearDepth");
            this.settingsFolder.add(this.pass, "needsSwap");
            this.settingsFolder.add(this.pass, "enabled");

            this.settingsFolder
                .add(this.pass, "renderToScreenInternal")
                .name("Skip fx and render to screen");
        }
    };

    setUpGui = (before = null) => {
        const gui = this.gui;
        this.folder = gui.addFolder(this.__id, {
            useTitleRow: true,
            moveButtons: true,
            before,
            remove: this.removeMe
        });
        this.folder.upFunction = () =>
            this.__moveScene({ up: true, scene: this });
        this.folder.downFunction = () =>
            this.__moveScene({ up: false, scene: this });
        this.itemsFolder = this.folder.addFolder("Items", { addButton: true });

        this.itemsFolder.add(this, "addItem");
        this.cameraFolder = this.folder.addFolder("Camera");
        this.settingsFolder = this.folder.addFolder("Settings");
        this.addController(this.settingsFolder, this.folder, "name").name(
            "Scene name"
        );
        this.addController(this.cameraFolder, this, "resetCamera");
        this.settingsFolder.add(this, "removeMeWithModal").name("Remove this scene");

        this.items.forEach(item => {
            item.__gui = this.itemsFolder;
            item.__setUpFolder();
        });
    };

    __serialize = () => {
        let sceneConfig = {
            __settings: serialize(this),
            __passSettings: serialize(this.pass),
            __automations: this.__automations,
            __items: [],
            __controllers: this.__serializeControllers()
        };

        this.items.forEach(item => {
            sceneConfig.__items.push(item.serialize());
        });
        sceneConfig.camera = this.camera.matrix.toArray();
        sceneConfig.controls = {
            enabled: this.controls.enabled,
            target: this.controls.target
        }

        sceneConfig.controlsEnabled = this.controls.enabled;

        return sceneConfig;
    };

    removeMeWithModal = () => {
        this.gui
            .getRoot()
            .modalRef.toggleModal(22, true, { title: this.folder.name })
            .then(response => {
                if (response) {
                    this.removeMe();
                }
            });
    };

    removeMe = () => {
        this.items.forEach(item => {
            this.removeItem(item);
        });

        if (this.type === "canvas") {
            this.tex.dispose();
            this.geo.dispose();
            this.mat.dispose();
        }

        this.controls.dispose();
        this.items = [];
        this.scene.dispose();

        this.remove({ scene: this });
    };

    removeItem = item => {
        const index = this.items.findIndex(e => e === item);
        if (this.type !== "canvas" && this.type !== "pixi") {
            this.scene.remove(item.mesh);
        }

        item.dispose();
        Object.keys(item.__controllers).forEach(key => {
            item.__controllers[key].__subControllers.forEach(folder => {
                try {
                    folder.parent.remove(folder);
                } catch (err) {
                    console.log("Could not remove controller from overview");
                }
            });
            item.__controllers[key].__subControllers = [];
        });

        item.folder.parent.removeFolder(item.folder);
        delete item.folder.parent.__folders[item.__id];
        this.items.splice(index, 1);
    };

    removeItemWithModal = args => {
        this.gui
            .getRoot()
            .modalRef.toggleModal(22, true, { title: args.item.name })
            .then(response => {
                const { item } = args;
                if (response) {
                    this.removeItem(item);
                }
            });
    };

    stop = () => {
        this.items.forEach(item => {
            item.stop();
        });
    };

    getInfoObject = () => {
        if (this.type === "canvas") {
        }
    };

    addItemFromText = (name, fromTemplate = true) => {
        if (name) {
            let info = {
                gui: this.itemsFolder,
                type: this.type,
                width: this.resolution.width,
                height: this.resolution.height,
                scene: this.scene,
                camera: this.camera,
                remove: this.removeItemWithModal
            };

            if (this.type === "canvas") {
                info = { ...info, ctx: this.ctx, canvas: this.canvas };
            } else if (this.type === "pixi") {
                info = {
                    ...info,
                    canvas: this.canvas,
                    container: this.container,
                    graphics: this.graphics
                };
            }

            const itemClass = getItemClassFromText(this.type, name);
            const item = new itemClass(info);
            item.__itemName = name;
            this.items.push(item);


            return item;
        }
    };

    addItem = () => {
        const ref = this.itemsFolder.__root.modalRef;
        ref.toggleModal(this.MODAL_REF_NR).then(text =>
            this.addItemFromText(text, false)
        );
    };

    render = renderer => {
        this.items.forEach(item => {
            item.render(renderer, this.camera);
        });

        renderer.render(this.scene, this.camera);
    };

    update = (time, dt, audioData, shouldIncrement) => {
        this.applyAutomations(shouldIncrement);
        if (shouldIncrement) {
            this.items.forEach(item => {
                item.mesh.visible =
                    item.__startTime <= time && item.__endTime >= time;
                item.applyAutomations(shouldIncrement);
                item.update(time, dt, audioData);
            });
        }
    };
}
