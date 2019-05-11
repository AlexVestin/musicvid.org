import * as THREE from "three";
import AttribItem from "./items/ortho/Attribution";
import CanvasScene from "./scenes/CanvasScene";
import OrthographicScene from "./scenes/OrthographicScene";
import PerspectiveScene from "./scenes/PerspectiveScene";
import PostProcessing from "./postprocessing/postprocessing";
import * as FileSaver from "file-saver";
import serialize from './Serialize'
import { base, app } from 'backend/firebase'
import PointAutomation from './automation/PointAutomation'
import InputAutomation from './automation/InputAutomation'
import ImpactAutomation from './automation/AudioReactiveAutomation'
import uuid from 'uuid/v4'

export default class WebGLManager {
    constructor(gui) {
        this.fftSize = 16384;
        this.canvasMountRef = gui.canvasMountRef;
        this.modalRef = gui.modalRef;
        this.gui = gui;

        this.scenes = [];
        this.audio = null;
        this.inFullScreen = false;

        this.clearColor = "#000000";
        this.clearAlpha = 1.0;
        this.postprocessingEnabled = false;
        this.__id = uuid();
        this.__projectName  = "ProjectName";
        this.__lastEdited = new Date().toString();

        document.body.addEventListener("keyup", e => {
            if (e.keyCode === 70) {
                if (!this.inFullScreen) {
                    this.fullscreen(this.canvasMountRef);
                }else {
                    try {
                        this.exitFullscreen()
                    }catch(err) {
                        console.log("Error exiting fullscreen");
                    }
                }

                this.inFullScreen = !this.inFullScreen;
            }
        });
    }

    addAutomation = (template) => {
        let auto  = {};
        switch(template.type) {
            case "point":
            auto =  new PointAutomation(this.gui);
            break;
            case "math":
            auto =  new InputAutomation(this.gui);
            break;
            case "audio":
            auto =  new ImpactAutomation(this.gui);
            break;
        default:
            alert(":(");
        }
        auto.__id = template.__id;
        auto.__setUpValues(template);
        this.gui.getRoot().__automations[auto.__id] = auto;
    }

    loadProject = (json) => {
        while(this.scenes.length > 0) {
            this.scenes[0].removeMe();
        }

        Object.assign(this, json.settings);
        this.settingsFolder.updateDisplay();
        json.automations.forEach(auto => {
            this.addAutomation(auto);
        })

        json.scenes.forEach(scene => {                
            if(scene.__settings.isScene) {
                const s = this.addSceneFromText(scene.__settings.TYPE);
                s.undoCameraMovement(scene.camera);
                s.controls.enabled = scene.controlsEnabled; 
                s.addItems(scene.items);
                s.updateSettings();
                Object.assign(s.pass, scene.__passSettings);
            }else {
                const e = this.postProcessing.addEffectPass(scene.__settings.TYPE);
                e.__setControllerValues(scene.controllers);
            }
        })
    }

    loadProjectFromFile = () => {
        this.gui.getRoot().modalRef.toggleModal(16).then(file => {
            if(file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const json = JSON.parse(e.target.result);
                    this.loadProject(json);    
                }
                reader.readAsText(file);
            }
        })
    }

    saveProjectToFile = () => {
        const rootGui = this.gui.getRoot();
        const projFile = {
            scenes: [],
            settings: {}
        };
        projFile.settings = serialize(this);
        projFile.automations = Object.keys(rootGui.__automations).map(key => rootGui.__automations[key].__serialize());
        
        this.scenes.forEach( (scene, i) => {
            if(scene.isScene) {
                let sceneConfig = {
                    __settings: serialize(scene),
                    __passSettings: serialize(scene.pass),
                    items: []
                }
                
                scene.items.forEach(item => {
                    sceneConfig.items.push(item.serialize());
                });
                sceneConfig.camera = scene.camera.matrix.toArray()
                sceneConfig.controlsEnabled = scene.controls.enabled;
                
                projFile.scenes.push(sceneConfig);
            } else {
                const t = scene.serialize();
                t.__settings = {isScene: false, TYPE: scene.TYPE}
                projFile.scenes.push(t);
            }
        })

        const blob = new Blob([JSON.stringify(projFile)], { type: 'application/json' });
        FileSaver.saveAs(blob,"project.json");
        const ref = base.collection("users").doc(app.auth().currentUser.uid).collection("projects").doc(this.__id);
        ref.set({
            str: JSON.stringify(projFile), 
            lastEdited: new Date().toString(),
            name: this.__projectName,
            width: this.width,
            height: this.height,
            id: this.__id
        });

        console.log(projFile);
    }

    setUpAttrib() {
        // Set up scene for attribution text
        this.attribScene = new THREE.Scene();
        this.attribCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.attribCamera.position.z = 1;
        this.attribItem = new AttribItem(this.width, this.height);
        this.attribScene.add(this.attribItem.mesh);
        this.drawAttribution = false;
    }

    removeScene = args => {
        const { scene, undoAction } = args;
        try {
            scene.folder.parent.removeFolder(scene.folder);
        }catch(err) {
            alert("folder not removed correctly");
        }
        
        const index = this.scenes.findIndex(e => e === scene);
        this.scenes.splice(index, 1);

        if (!undoAction) {
            const it = {
                func: this.undoRemoveScene,
                args: { scene, index },
                type: "action"
            };
            this.gui.getRoot().addUndoItem(it);
        }

        this.postProcessing.remove(scene, index);
    };

    undoRemoveScene = ele => {
        const scenes = this.scenes;
        const fold =
            ele.index === scenes.length ? null : scenes[ele.index].folder;
        ele.scene.setUpGui(fold);
        this.scenes.splice(ele.index, 0, ele.scene);
    };

    moveScene = args => {
        let { up, scene } = args;
        if (!args.undoAction) {
            const it = {
                func: this.moveScene,
                args: { up: !up, scene: scene, undoAction: true },
                type: "action"
            };
            this.gui.getRoot().addUndoItem(it);
        }

        const folder = scene.folder.domElement.parentElement;
        const list = folder.parentElement;
        const ch = Array.prototype.slice.call(list.children);
        
        // nr items in the gui before the layers 
        const ni = 2;
        const index = ch.indexOf(folder) - ni;
        if (up && index > 0 && index !== ch.length - ni) {
            list.insertBefore(list.children[index + ni], list.children[index + ni - 1]);
            this.scenes.splice(index, 1);
            this.scenes.splice(index - 1, 0, scene);
            this.postProcessing.move(index, index - 1, scene);
        }

        if (!up && index < ch.length - 1 - ni) {
            list.insertBefore(list.children[index + ni + 1], list.children[index + ni]);
            this.scenes.splice(index, 1);
            this.scenes.splice(index + 1, 0, scene);
            this.postProcessing.move(index, index + 1, scene);
        }
    };

    addSceneFromText = sceneName => {
        let scene;
        if (sceneName === "canvas") {
            scene = new CanvasScene(
                this.layersFolder,
                this.resolution,
                this.removeScene,
                this.moveScene
            );
        } else if (sceneName === "ortho") {
            scene = new OrthographicScene(
                this.layersFolder,
                this.resolution,
                this.removeScene,
                this.moveScene
            );
        } else if (sceneName === "perspective") {
            scene = new PerspectiveScene(
                this.layersFolder,
                this.resolution,
                this.removeScene,
                this.moveScene
            );
        }else {
            this.postProcessing.addEffect(sceneName);
            return
        }

        this.postProcessing.addRenderPass(scene);
        this.scenes.push(scene);
        scene.setUpPassConfigs();
        return scene;
    };

    serialize = () => {
        const settings = {};
        settings.clearColor = this.clearColor;

    }

    addScene = () => {
        this.modalRef.toggleModal(8).then(sceneName => {
            if (sceneName) {
                const scene = this.addSceneFromText(sceneName);
                this.gui
                    .getRoot()
                    .addUndoItem({
                        type: "action",
                        args: { scene, undoAction: true },
                        func: this.removeScene
                    });
            }
        });
    };

    init = (resolution, setUpFolders = true) => {
        this.resolution = resolution;
        this.width = resolution.width;
        this.height = resolution.height;
        this.aspect = this.width / this.height;
        this.setUpAttrib();

        if (setUpFolders) {
            this.layersFolder = this.gui.__folders["Layers"];
            this.layersFolder.add(this, "addScene");
        }
        // Set up internal canvas to keep canvas size on screen consistent

        this.canvas = this.canvasMountRef;
        //this.externalCtx = this.canvasMountRef.getContext("2d");
        //this.internalCanvas = document.createElement("canvas");
        //this.internalCanvas.width = this.width;
        //this.internalCanvas.height = this.height;

        this.setUpRenderers(setUpFolders);
        this.setUpScene();
    };

    refresh = ref => {
        this.canvasMountRef = ref;
        this.canvas = ref;
        this.setUpRenderer();
    };

    getAllItems = () => {
        const items = [];
        this.scenes.forEach(scene => {
            if(scene.isScene) {
                scene.items.forEach(item => {
                    items.push(item.__attribution);
                });
            }
            
        });
        return items;
    };

    manageAutomations = () => {
        this.gui.getRoot().modalRef.toggleModal(12);
    };

    setClear = () => {
        this.renderer.setClearColor(this.clearColor);
        this.renderer.setClearAlpha(this.clearAlpha);
    };

    setAudio = audio => {
        this.audio = audio;
        this.setFFTSize(this.fftSize);
    };

    setFFTSize = size => {
        this.audio.setFFTSize(size);
        this.gui.__folders["Audio"].updateDisplay();
    };

    setTime = time => {};

    updateAttribution = () => {
        const items = this.getAllItems();
        const names = ["Visuals by:"];
        items.forEach(item => {
            item.authors.forEach(author => {
                if (names.indexOf(author.name) < 0) {
                    names.push(author.name);
                }
            });
        });

        this.attribItem.setText(names, 0.75, -0.6);
    };

    setUpRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: this.canvas
        });
        this.renderer.autoClear = false;
        this.renderer.setSize(this.width, this.height);
        this.setClear();
        this.postProcessing = new PostProcessing(this.width, this.height, {
            renderer: this.renderer,
            gui: this.layersFolder,
            addEffect: this.addNewEffect,
            moveItem: this.moveScene,
            removeItem: this.removeScene
        });
    }

    addNewEffect  = (effect) => {
        this.scenes.push(effect);
    }

    setUpRenderers = (setUpFolders = true) => {
        this.setUpRenderer();
        
        const frequencies = [1,5,30,60];
        if (setUpFolders) {
            this.settingsFolder = this.gui.__folders["Settings"];
            this.settingsFolder
                .add(this.gui, "__automationConfigUpdateFrequency", frequencies)
                .name("configUpdateFrequency");
            const rs = this.settingsFolder.addFolder("Render settings");
            
            rs.addColor(this, "clearColor")
                .onChange(this.setClear);
            
            rs.add(this, "clearAlpha", 0, 1, 0.001)
                .onChange(this.setClear)
                .disableAutomations();
            rs.add(this, "drawAttribution")
                .onChange(this.updateAttribution);
            this.gui.__folders["Layers"].add(this, "postprocessingEnabled");

            const cs = this.settingsFolder.addFolder("Camera and control settings");
            cs.add(this, "enableAllControls");
            cs.add(this, "disableAllControls");
            cs.add(this, "resetAllCameras");
            cs.add(this, "manageAutomations");
            const ps = this.settingsFolder.addFolder("Project settings");
            ps.add(this, "__projectName").name("Project name");
            ps.add(this, "loadProjectFromFile");
            ps.add(this, "saveProjectToFile");
        }
    };

    resetAllCameras = () => {
        this.scenes.forEach(scene => {
            if(scene.isScene)
                scene.resetCamera();
        });
    };

    disableAllControls = () => {
        this.scenes.forEach(scene => {
            if(scene.isScene) {
                scene.controls.enabled = false;
                scene.cameraFolder.updateDisplay();
            }
        });
    };

    enableAllControls = () => {
        this.scenes.forEach(scene => {
            if(scene.isScene) {
                scene.controls.enabled = true;
                scene.cameraFolder.updateDisplay();
            }
           
        });
    };

    exitFullscreen(canvas) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    }
    fullscreen(canvas) {
        if (canvas.RequestFullScreen) {
            canvas.RequestFullScreen();
        } else if (canvas.webkitRequestFullScreen) {
            canvas.webkitRequestFullScreen();
        } else if (canvas.mozRequestFullScreen) {
            canvas.mozRequestFullScreen();
        } else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen();
        } else {
            alert("This browser doesn't supporter fullscreen");
        }
    }

    readPixels = () => {
        const { width, height } = this;
        const glContext = this.renderer.getContext();
        const pixels = new Uint8Array(width * height * 4);
        glContext.readPixels(
            0,
            0,
            width,
            height,
            glContext.RGBA,
            glContext.UNSIGNED_BYTE,
            pixels
        );
        return pixels;
    };

    stop = () => {
        //this.externalCtx.clearRect( 0, 0, this.canvasMountRef.width, this.canvasMountRef.height);
        this.scenes.forEach(scene => {
            scene.stop();
        });
        this.renderer.clear();
    };

    setUpScene() {
        console.log("Implement this");
    }

    update = (time, audioData, shouldIncrement) => {
        if (!this.postprocessingEnabled) {
            this.renderer.clear();
            this.scenes.forEach(scene => {
                if (scene.TYPE !== "" && scene.isScene) {
                    scene.update(time, audioData, shouldIncrement);
                    this.renderer.render(scene.scene, scene.camera);
                    this.renderer.clearDepth();
                }
            });
        } else {
            this.postProcessing.update(time, audioData, shouldIncrement);
            this.postProcessing.render();
        }

        if (this.drawAttribution) {
            this.renderer.render(this.attribScene, this.attribCamera);
        }

        //this.externalCtx.drawImage(this.internalCanvas, 0, 0, Math.floor(this.canvasMountRef.width), Math.floor(this.canvasMountRef.height));
    };
}
