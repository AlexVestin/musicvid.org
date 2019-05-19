import license from "editor/util/License";
import SerializableObject from "../SerializableObject";

export default class BaseItem extends SerializableObject {
    LICENSE = license;
    folders = [];
    __attribution = {
        showAttribution: false,
        name: "",
        authors: [],
        description: "",
        license: "",
        changeDisclaimer: true,
        imageUrl: ""
    };

    constructor(info) {
        super();
        this.__startTime = 0;
        this.__endTime = 600;
        this.name = "";
        this.__isEncoding = false;

        if (info) {
            this.width = info.width;
            this.height = info.height;
            // Serializing for project files
            this.__controllers = {};
            this.__scale = 1;
            this.__gui = info.gui;
            this.parentRemove = info.remove;
            this.folder = this.__gui.addFolder(this.name);
            this.preFolderSetup(this.folder);
        }
    }

    __setUniforms = () => {
        console.log("sey iy up");
    };

    _add = (f, n, options) => {
        const c = f.add(this, n, options.min, options.max, options.step);
        let p = options.path;
        if(!p) {
            p = n;
        }

        if(this.__controllers[p])
            alert("bad controller path")

        this.__controllers[p] = c;
        c.__path = p;
    }

    dispose = () => {
        
    }


    setFolderName = name => {
        this.folder.name = name;
        this.name = name;
        this.__nameDisplay.updateDisplay();
    };

    preFolderSetup = folder => {
        this.__nameDisplay = folder
            .add(this, "name")
            .onChange(() => this.setFolderName(this.name));
        folder.add(this, "__startTime", 0, 1000).name("Start time(sec)").disableAutomations();
        folder.add(this, "__endTime", 0, 1000).name("End time(sec)").disableAutomations();
    };

    postFolderSetup = folder => {
        this.folders.push(folder);
        this.removeButton = folder.add(this, "remove");
    };

    setUpFolder = () => {
        this.setFolderName(this.name);
        this.__setUpGUI(this.folder);
        this.postFolderSetup(this.folder);
        return this.folder;
    };

    __setUpGUI = () => {};

    __addUndoAction = (func, args) => {
        const item = { func: func, args: args, type: "action" };
        this.folder.getRoot().addUndoItem(item);
    };

    __reAdd = () => {
        this.setUpFolder();
    };

    __addFolder = folder => {
        return folder;
    };

    remove = () => {
        if (!this.parentRemove) {
            console.log("CALL SUPER WITH ARGUMENTS");
            return;
        }

        this.parentRemove({ item: this });
    };

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        /* ADD STUFF TO FOLDER HERE */
        return this.__addFolder(folder);
    };

    // handles all updates in the render-loop
    update = () => {};
    setTime = () => {};
    stop = () => {};
    seekTime = (t) => {}; 
    play = (t) => {};
    setUpGUI = () => {};

    updateDisplay = () => {
        this.folders.forEach(folder => {
            folder.updateDisplay();
        });
    };
}
