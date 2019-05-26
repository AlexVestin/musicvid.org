
import SerializableObject from './animation/SerializableObject'
export default class OverviewgGroup extends SerializableObject {
    constructor(gui) {
        super();
        this.folder = gui.addFolder(this.__id);
        this.name = "Group";
        this.folder.name = this.name;
        this.folder.__id = this.__id;
        this.addController(this.folder, this, "name").onChange(() => this.folder.name = this.name).disableAll();
    }

}