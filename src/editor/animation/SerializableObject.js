
import uuid from 'uuid/v4'
export default class SerializableObject {
    constructor() {
        this.__id = uuid(); 
        this.__automations = [];
        this.__controllers = {};
    }
    __setControllerValues = (values) => {
        Object.keys(values).forEach(key => {
            this.__controllers[key].setValue(values[key]);
            this.__controllers[key].updateDisplay();
        })
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

    addController = (gui, object, name, arg1=null, arg2=null, arg3=null) => {
        let options = {}
        if(arg2) {
            options.min = arg1;
            options.max = arg2;
            options.step = arg3;
        }else {
            options = arg1 || {};
        }
        let c;
        if(options.values) {
            c = gui.add(object, name, options.values);
        }else if(options.color) {
            c = gui.addColor(object, name);
        }else {
            c = gui.add(object, name, options.min, options.max, options.step);
        } 

        const n = options.path ? options.path + ":" +  name : name;
        c.__path = n;
        c.__parentObject = this;
        this.__controllers[n] = c;
        return c;
    }

    applyAutomations = () => {
        this.__automations.forEach(link => {
            const automation = this.__gui.getRoot().__automations[link.automationID]; 
            const controller = this.__controllers[link.controllerID];
            automation.apply(controller, link.type);
        })
    }
}