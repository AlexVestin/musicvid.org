
import uuid from 'uuid/v4'
export default class SerializableObject {
    constructor() {
        this.__id = uuid(); 
        this.__automations = [];
        this.__controllers = {};
    }
    __setControllerValues = (values) => {
        const objectsToLoad = [];
        Object.keys(values).forEach(key => {
            const obj = values[key];
            const controller = this.__controllers[key];
            if(obj.needLoad) {
                objectsToLoad.push({controller, name: obj.value, fileInfo: obj.fileInfo });
            }else {
                controller.setValue(values[key].value);
                controller.updateDisplay();
            }
        });
    }
    
    serialize = () => {
        const obj = {controllers: {}};
        Object.keys(this.__controllers).forEach(key => {
            const c = this.__controllers[key]

            if(c.object[c.property] !== Object(c.object[c.property])) {
                obj.controllers[key] = {value: c.object[c.property], needLoad: false } 
            }else if(c.__fileInfo){
                obj.controllers[key] = {value: c.__name, needLoad: true, fileInfo: c.__fileInfo }; 
            }else {
                console.log(c.__name);
            }
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
        c.__loadInfo = options.loadInfo; 
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