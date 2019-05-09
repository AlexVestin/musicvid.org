
import uuid from 'uuid/v4'
export default class SerializableObject {
    constructor() {
        this.__id = uuid(); 
        this.__automations = [];
        this.__controllers = {};
    }

    __addFolder = (gui, name, options = {}) => {

    }   
    __setControllerValues = (values) => {
        Object.keys(values).forEach(key => {
            console.log(key);
            this.__controllers[key].setValue(values[key]);
            this.__controllers[key].updateDisplay();
        })
    }

    __setUpAutomations = () => {
        const rootGui = this.__gui.getRoot();

    }
    
    serialize = () => {
        const obj = {controllers: {}};
        Object.keys(this.__controllers).forEach(key => {
            const c = this.__controllers[key]
            obj.controllers[key] = c.object[c.property];
        });
        obj.__itemName = this.__itemName;
        obj.__automations  = this.__automations;
        obj.name = this.name;
        obj.__startTime = this.startTime;
        obj.__endTime = this.__endTime;

        return obj;
    }

    addController = (gui, object, name, options={}) => {
        const c = gui.add(object, name, options.min, options.max, options.step);
        const n = options.path ? options.path + ":" +  name : name;
        this.__controllers[n] = c;
        return c;
    }

    applyAutomations = () => {
        this.__automations.forEach(link => {
            const automation = this.__gui.getRoot().__automations[link.automationID]; 
            automation.apply(link.controller, link.type);
        })
    }
}