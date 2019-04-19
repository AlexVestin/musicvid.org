import license from 'editor/util/License'

export default class BaseItem {
    LICENSE = license;
    folders = [];
    __attribution = {
        showAttribution: false,
        name:"",
        authors: [
        ],
        description: "",
        license: "",
        changeDisclaimer: true,
        imageUrl: ""
    }

    constructor(info) {
       

        if(info) {
            this.__gui = info.gui;
            this.__overviewFolder = info.overviewFolder;
            this.parentRemove = info.remove; 
        }
    }

    dispose = () => {
        if(this.ovFolder)
            this.ovFolder.parent.removeFolder(this.ovFolder);
    }

    setFolderName = (name) => {
        this.folder.name = name;
        this.ovFolder.name = name;
        this.name = name;
    }

    __setUpFolder = () =>  {
        //this.folder = this.setUpGUI(this.__gui, this.name);
        //this.ovFolder = this.setUpGUI(this.__overviewFolder, this.name);
    }

    __addUndoAction = (func, args) => {
        const item = {func: func, args: args, type: "action"}
        this.folder.getRoot().addUndoItem(item);
    }

    __reAdd = () => {
        this.__setUpFolder();
    }
 
    __addFolder = (folder) => {
        this.folders.push(folder);
        folder.add(this, "remove");
        return folder;
    }

    remove = () => {
        if(!this.parentRemove) {
            console.log("CALL SUPER WITH ARGUMENTS")
            return;
        }

        //this.folder.parent.removeFolder(this.folder);
        //this.ovFolder.parent.removeFolder(this.ovFolder);
        this.parentRemove({item: this});
    }

    setUpGUI = (gui, name) => {
        
        const folder = gui.addFolder(name);
        /* ADD STUFF TO FOLDER HERE */
        return this.__addFolder(folder);
    }

    // handles all updates in the render-loop 
    update = () => {}
    applyAutomations = ()  => {}
    setTime = () => {}
    stop = () => {}
    play = () => {}
    setUpGUI =  () => {}

    updateDisplay = () => {
        this.folders.forEach(folder => {
            folder.updateDisplay();
        })
    }
}