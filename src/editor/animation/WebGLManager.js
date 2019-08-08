import * as THREE from "three";
import AttribItem from "./items/ortho/Attribution";
import CanvasScene from "./scenes/CanvasScene";
import PixiScene from "./scenes/PixiScene";

import OrthographicScene from "./scenes/OrthographicScene";
import PerspectiveScene from "./scenes/PerspectiveScene";
import PostProcessing from "./postprocessing/postprocessing";
import * as FileSaver from "file-saver";
import serialize from "./Serialize";
import { base, app } from "backend/firebase";
import PointAutomation from "./automation/PointAutomation";
import InputAutomation from "./automation/InputAutomation";
import ImpactAutomation from "./automation/AudioReactiveAutomation";
import uuid from "uuid/v4";
//import { takeScreenShot } from 'editor/util/FlipImage'
//import MockWebGLManager from './MockWebGLManager'

import OverviewGroup from "../OverviewGroup";

import { setUpFullscreenControls } from "./FullscreenUtils";
import { setSnackbarMessage } from "../../fredux/actions/message";
export default class WebGLManager {
    constructor(parent) {
        // Set up for headless testing;
        if (parent) {
            this.gui = parent.gui;
            this.canvasMountRef = parent.gui.canvasMountRef;
            this.modalRef = parent.gui.modalRef;
            this.parent = parent;
            setUpFullscreenControls(parent.gui);
        }

        // Project settings
        this.advancedMode = true;
        this.inFullScreen = false;
        this.clearColor = "#000000";
        this.clearAlpha = 1.0;
        this.postprocessingEnabled = false;
        this.fftSize = 16384;

        // Project file settings
        this.__id = uuid();
        this.__projectName = "ProjectName";
        this.__lastEdited = new Date().toString();
        this.availablePublic = false;

        // Redraw animations settings
        this.__lastTime = 0;
        this.__lastAudioData = {
            frequencyData: new Float32Array(this.fftSize / 2),
            timeData: new Float32Array(this.fftSize)
        };

        // Scenes
        this.scenes = [];
        this.audio = null;

        // Set project to advanced to add correct buttons
        if (!this.parent.test) {
            this.parent.toggleAdvancedMode(true);
        }

        this.fps = 60;
    }

    saveAsNewProjectToProfile = () => {
        this.__id = uuid();
        this.saveProjectToProfile();
    };

    addAutomation = template => {
        let auto = {};
        switch (template.type) {
            case "point":
                auto = new PointAutomation(this.gui);
                break;
            case "math":
                auto = new InputAutomation(this.gui);
                break;
            case "audio":
                auto = new ImpactAutomation(this.gui);
                break;
            default:
                alert("Automation type not found");
        }
        auto.__id = template.__id;
        auto.__setUpValues(template);
        this.gui.getRoot().__automations[auto.__id] = auto;
    };

    loadProject = json => {
        while (this.scenes.length > 0) {
            this.scenes[0].removeMe();
        }

        if (this.renderer) {
            this.renderer.renderLists.dispose();
            this.renderer.dispose();
        }

        const root = this.gui.getRoot();
        this.parent.clearOverviewFolder();
        root.__automations = [];

        const proj = JSON.parse(json.projectSrc);
        if (proj.overviewFolders) {
            proj.overviewFolders.forEach(fold => {
                new OverviewGroup(
                    root.__folders["Overview"],
                    fold.id,
                    fold.name,
                
                );
            });
        };
        console.log(proj);

        Object.assign(this, proj.settings);
        this.settingsFolder.updateDisplay();
        proj.automations.forEach(auto => {
            this.addAutomation(auto);
        });
        // NEEDS TO BE AFTER Object.assign above
        this.__id = json.id;
        this.__ownerId = json.owner;
        this.__online = json.online;

        proj.scenes.forEach(scene => {
            if (scene.__settings.isScene) {
                const s = this.addSceneFromText(
                    scene.__settings.type || scene.__settings.TYPE
                );
                s.undoCameraMovement(scene.camera);
                s.controls.enabled = scene.controlsEnabled;
                s.__automations = scene.__automations;
                if (scene.__controllers)
                    s.__setControllerValues(scene.__controllers.controllers);
                s.addItems(scene.__items || scene.items);
                s.updateSettings();
                Object.assign(s.pass, scene.__passSettings);
            } else {
                const e = this.postProcessing.addEffectPass(
                    scene.__settings.type || scene.__settings.TYPE
                );
                e.__setControllerValues(scene.controllers);
            }
        });

        if (this.audio) {
            this.setFFTSize(this.fftSize);
        }

        this.parent.toggleAdvancedMode(this.advancedMode);
        this.projectSettingsFolder.updateDisplay();
        this.gui.updateDisplay();
    };

    loadProjectFromFile = () => {
        this.gui
            .getRoot()
            .modalRef.toggleModal(16)
            .then(file => {
                if (file) {
                    const reader = new FileReader();
                    reader.onload = e => {
                        const json = JSON.parse(e.target.result);
                        this.loadProject(json);
                    };
                    reader.readAsText(file);
                }
            });
    };

    serializeProject = () => {
        const projFile = {
            scenes: [],
            settings: {}
        };
        projFile.settings = serialize(this);
        projFile.settings.__lastTime = undefined;
        projFile.settings.fftSize = this.audio
            ? this.audio.fftSize
            : this.fftSize;
        projFile.automations = this.gui
            .getAutomations()
            .map(auto => auto.__serialize());

        const ov = this.gui.getRoot().__folders["Overview"].__folders;
        projFile.overviewFolders = Object.values(ov).map(f => {
            return { name: f.name, id: f.__id };
        });

        this.scenes.forEach((scene, i) => {
            projFile.scenes.push(scene.__serialize());
        });
        return projFile;
    };

    getProjectConfig = (projFile, ownerId) => {
        return {
            projectSrc: JSON.stringify(projFile),
            width: this.width,
            height: this.height,
            name: this.__projectName,
            public: this.availablePublic,
            owner: ownerId,
            id: this.__id
        };
    };

    saveProjectToFile = () => {
        const projFile = this.serializeProject();
        const f = this.getProjectConfig(projFile, this.__ownerId);
        const blob = new Blob([JSON.stringify(f)], {
            type: "application/json"
        });
        FileSaver.saveAs(blob, this.__projectName + ".json");
    };

    saveProjectToProfile = () => {
        const projFile = this.serializeProject();
        const cu = app.auth().currentUser;
        if (cu) {
            if (cu.uid !== this.__ownerId) {
                this.__id = uuid();
                this.__ownerId = cu.uid;
                console.log("Setting new uid");
            }

            const myId = app.auth().currentUser.uid;
            const ref = base
                .collection("users")
                .doc(myId)
                .collection("projects")
                .doc(this.__id);

            const p1 = ref.set({
                lastEdited: new Date().toString(),
                name: this.__projectName,
                id: this.__id
            });

            const allRef = base.collection("projects").doc(this.__id);
            const p2 = allRef.set(this.getProjectConfig(projFile, myId));

            /*let p3;
            if(!this.__online) {
                this.redoUpdate();
                const blob = takeScreenShot(this.canvas);
                p3 = storage.ref().child(this.__id).put(blob)
            }*/

            console.log(projFile)

            Promise.all([p1, p2]).then(() => {
                setSnackbarMessage("Saved to profile", "success", 2000);
                window.history.pushState(
                    {},
                    null,
                    "/editor?project=" + this.__id
                );
                this.__online = true;
                allRef.update({ online: true });
            });
        } else {
            setSnackbarMessage(
                "You need to log in to be able to save to your profile.",
                "error"
            );
        }
    };

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
        const { scene } = args;
        try {
            this.layersFolder.removeFolder(scene.folder);
            this.layersFolder.__folders[scene.__id] = undefined;
            delete this.layersFolder.__folders[scene.__id];
        } catch (err) {
            console.log("Scene folder not removed correctly");
        }

        const index = this.scenes.findIndex(e => e === scene);
        this.scenes.splice(index, 1);
        this.postProcessing.remove(scene, index);
    };

    moveScene = args => {
        let { up, scene } = args;

        const folder = scene.folder.domElement.parentElement;
        const list = folder.parentElement;
        const ch = Array.prototype.slice.call(list.children);

        // nr items in the gui before the layers
        const ni = 2;
        const index = ch.indexOf(folder) - ni;
        if (up && index > 0 && index !== ch.length - ni) {
            list.insertBefore(
                list.children[index + ni],
                list.children[index + ni - 1]
            );
            this.scenes.splice(index, 1);
            this.scenes.splice(index - 1, 0, scene);
            this.postProcessing.move(index, index - 1, scene);
        }

        if (!up && index < ch.length - 1 - ni) {
            list.insertBefore(
                list.children[index + ni + 1],
                list.children[index + ni]
            );
            this.scenes.splice(index, 1);
            this.scenes.splice(index + 1, 0, scene);
            this.postProcessing.move(index, index + 1, scene);
        }
    };

    addSceneFromText = sceneName => {
        const sceneTypes = {
            canvas: CanvasScene,
            ortho: OrthographicScene,
            perspective: PerspectiveScene,
            pixi: PixiScene
        };
        let scene;
        if (!(sceneName in sceneTypes)) {
            this.postProcessing.addEffect(sceneName);
            return;
        } else {
            scene = new sceneTypes[sceneName](
                this.layersFolder,
                this.resolution,
                this.removeScene,
                this.moveScene,
                this.renderer,
                this.canvas
            );
        }

        this.postProcessing.addRenderPass(scene);
        this.scenes.push(scene);
        scene.setUpPassConfigs();

        return scene;
    };

    serialize = () => {
        const settings = {};
        settings.clearColor = this.clearColor;
    };

    addScene = () => {
        this.modalRef.toggleModal(8).then(sceneName => {
            if (sceneName) {
                this.addSceneFromText(sceneName);
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
            this.layersFolder
                .add(this, "addScene")
                .name("Add layer")
                .disableAll();
        }
        this.canvas = this.canvasMountRef;
        this.setUpRenderers(setUpFolders);
        this.setUpScene();
    };

    setUpScene() {}

    refresh = ref => {
        this.canvasMountRef = ref;
        this.canvas = ref;
        this.setUpRenderer();
    };

    getAllItems = () => {
        const items = [];
        this.scenes.forEach(scene => {
            if (scene.isScene) {
                scene.items.forEach(item => {
                    items.push(item.__attribution);
                });
            }
        });
        return items;
    };

    start = () => {
        this.scenes.forEach(scene =>  { 
            if(scene.isScene) {
                scene.items.forEach(item => item.start())
            }
        });
    }

    play = t => {
        this.start();
        this.scenes.forEach(scene => scene.play(t));
    };

    prepareEncoding = () => {
        this.scenes.forEach(scene => {
            if (scene.isScene) {
                scene.items.forEach(item => {
                    item.prepareEncoding();
                });
            }
        });
    };

    cancelEncoding = () => {
        this.scenes.forEach(scene => {
            if (scene.isScene) {
                scene.items.forEach(item => {
                    item.cancelEncoding();
                });
            }
        });
    };

    seekTime = t => {
        this.__lastTime = t;
        this.scenes.forEach(scene => scene.seekTime(t));
    };

    setClear = () => {
        this.renderer.setClearColor(this.clearColor);
        this.renderer.setClearAlpha(this.clearAlpha);

        console.log(this.clearAlpha,this.clearColor);
    };

    setAudio = audio => {
        this.audio = audio;
        this.setFFTSize(this.fftSize);
    };

    setFFTSize = size => {
        this.audio.setFFTSize(size);
        this.fftSize = size;
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
        const supportsWebGL = (function() {
            try {
                return (
                    !!window.WebGLRenderingContext &&
                    !!document
                        .createElement("canvas")
                        .getContext("experimental-webgl")
                );
            } catch (e) {
                return false;
            }
        })();

        if (supportsWebGL) {
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                canvas: this.canvas
            });
            this.renderer.autoClear = false;
            this.renderer.mock = false;
            this.renderer.setSize(this.width, this.height);
            this.setClear();
        } else {
            // TODO Error message

            if (!this.parent.test) {
                setSnackbarMessage(
                    "Couldn't load WebGL, make sure you have hardware graphics enabled",
                    "error"
                );
            }
            this.renderer = {};
            this.renderer.getDrawingBufferSize = () => {
                return { width: 1080, height: 720 };
            };
            this.renderer.mock = true;
            this.renderer.clear = () => {};
            this.renderer.clearDepth = () => {};
            this.renderer.render = () => {};
            this.renderer.setRenderTarget = () => {};
            this.postProcessing = {};
        }

        this.postProcessing = new PostProcessing(this.width, this.height, {
            renderer: this.renderer,
            gui: this.layersFolder,
            addEffect: this.addNewEffect,
            moveItem: this.moveScene,
            removeItem: this.removeScene
        });
    }

    addNewEffect = effect => {
        this.scenes.push(effect);
    };

    toggleAdvancedMode = () => {
        this.parent.toggleAdvancedMode(this.advancedMode);
    };

    setUpRenderers = (setUpFolders = true) => {
        this.setUpRenderer();

        if (setUpFolders) {
            const frequencies = [1, 5, 30, 60];
            this.settingsFolder = this.gui.__folders["Settings"];
            this.settingsFolder
                .add(this.gui, "__automationConfigUpdateFrequency", frequencies)
                .name("configUpdateFrequency");
            const rs = this.settingsFolder.addFolder("Render settings");

            rs.addColor(this, "clearColor").onChange(this.setClear).disableAll();

            rs.add(this, "clearAlpha", 0, 1, 0.001)
                .onChange(this.setClear)
                .disableAll();
            rs.add(this, "drawAttribution").onChange(this.updateAttribution);
            this.gui.__folders["Layers"].add(this, "postprocessingEnabled");

            const cs = this.settingsFolder.addFolder(
                "Camera and control settings"
            );
            cs.add(this, "enableAllControls");
            cs.add(this, "disableAllControls");
            cs.add(this, "resetAllCameras");
            const ps = this.gui.addFolder("Project", {useTitleRow: false});
            ps.add(this, "__projectName")
                .name("Project name")
                .disableAll();
            ps.add(this, "availablePublic")
                .name("Project available to public")
                .disableAll();
            ps.add(this, "loadProjectFromFile").disableAll().name("Load from file");
            //ps.add(this, "createThumbnail").disableAll();
            ps.add(this, "advancedMode")
                .onChange(this.toggleAdvancedMode)
                .disableAll();

            ps.add(this, "saveProjectToFile").disableAll().name("Save to file");
            ps.add(this, "saveProjectToProfile").disableAll().name("Save");
            ps.add(this, "saveAsNewProjectToProfile").disableAll().name("Save as new");

            this.projectSettingsFolder = ps;
        }
    };

    createThumbnail = () => {
        this.gui.getRoot().modalRef.toggleModal(19, true, this);
    };

    resetAllCameras = () => {
        this.scenes.forEach(scene => {
            if (scene.isScene) scene.resetCamera();
        });
    };

    disableAllControls = () => {
        this.scenes.forEach(scene => {
            if (scene.isScene) {
                scene.controls.enabled = false;
                scene.cameraFolder.updateDisplay();
            }
        });
    };

    enableAllControls = () => {
        this.scenes.forEach(scene => {
            if (scene.isScene) {
                scene.controls.enabled = true;
                scene.cameraFolder.updateDisplay();
            }
        });
    };

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
        this.__lastTime = 0;
        this.__lastAudioData = { frequencyData: [], timeData: [] };
        this.scenes.forEach(scene => {
            scene.stop();
        });
        this.gui
            .getRoot()
            .getAutomations()
            .forEach(auto => auto.stop());

        if (this.renderer) {
            this.renderer.clear();
        }
    };

    redoUpdate = () => {
        this.update(this.__lastTime, this.__lastAudioData, false);
    };

    update = (time, audioData, shouldIncrement) => {


        let dt = 1 / this.fps;

        console.log(time, dt, audioData, shouldIncrement)
        if (!this.postprocessingEnabled) {
            this.renderer.clear();
            this.scenes.forEach(scene => {
                if (scene.isScene) {
                    scene.update(time, dt, audioData, shouldIncrement);
                    scene.render(this.renderer);
                    this.renderer.clearDepth();
                }
            });
        } else {
            this.postProcessing.update(time, dt, audioData, shouldIncrement);
            this.postProcessing.render();
        }

        if (this.drawAttribution) {
            this.renderer.render(this.attribScene, this.attribCamera);
        }

        this.__lastTime = time;
        this.__lastAudioData = audioData;
    };
}
