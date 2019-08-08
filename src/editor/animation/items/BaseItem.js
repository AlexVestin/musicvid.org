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
        this.__endTime = 1000000;
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
            this.folder = this.__gui.addFolder(this.__id, { reset: this.reset } );
        }
    }

    setFolderName = name => {
        this.folder.name = name;
        this.name = name;
        this.__nameDisplay.updateDisplay();
    };

    preFolderSetup = folder => {
        this.__nameDisplay = this.addController(folder, this, "name")
            .onChange(() => this.setFolderName(this.name))
            .disableAll();
        this.addController(folder, this, "__startTime", 0, 1000000).name("Start time(sec)").disableAutomations();
        this.addController(folder, this, "__endTime", 0, 1000000).name("End time(sec)").disableAutomations();
    };

    postFolderSetup = folder => {
        this.folders.push(folder);
        this.removeButton = folder.add(this, "remove");
    };

    setUpFolder = () => {
        this.preFolderSetup(this.folder);
        this.setFolderName(this.name);
        this.__setUpGUI(this.folder);
        this.postFolderSetup(this.folder);
        return this.folder;
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
    __setUpGUI = () => {};
    dispose = () => {};
    update = () => {};
    setTime = () => {};
    stop = () => {};
    seekTime = (t) => {}; 
    start = () => {};
    play = (t) => {};
    setUpGUI = () => {};
    prepareEncoding = () => {};
    cancelEncoding = () => {};
    render = () => {};

}
