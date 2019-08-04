
import SerializableObject from './animation/SerializableObject'
export default class OverviewgGroup extends SerializableObject {
    constructor(gui, id, name) {
        super();
        this.name = "Group";
        if (id) {
            this.__id = id;
        }

        if (name) {
            this.name = name;
        }

        this.folder = gui.addFolder(this.__id);
        
        this.folder.name = this.name;
        this.folder.__id = this.__id;
        this.folder.__hide = this.toggleHide;
        this.hidden = false;
        
        this.added = true;
        this.addControllers();   
    }

    removeMe = () => {
        const r = this.folder.getRoot();
        r.modalRef.toggleModal(22, true, {title: this.name}).then(remove => {
            if (remove) {
                const p = this.folder.parent; 
                
                p.removeFolder(this.folder);
                delete p.__folders[this.__id];
            }
        });
    }

    addControllers = () => {
        this.nameBtn = this.addControllerWithMeta(this.folder, this, "name", {}).onChange(() => this.folder.name = this.name).disableAll();
        this.removeBtn = this.addControllerWithMeta(this.folder, this, "removeMe", {}).disableAll().name("Remove this group");
    }

    toggleHide = (on) => {
        if (!this.added && on) {
            this.added = true;
            this.addControllers();
        } else if(!on){
            if (this.added) {
                this.folder.remove(this.removeBtn);
                this.folder.remove(this.nameBtn);
                delete this.folder.__controllers[this.removeBtn.__id];
                delete this.folder.__controllers[this.nameBtn.__id];
            }

            this.added = false;
        }

        this.hidden = !on;
    }
}