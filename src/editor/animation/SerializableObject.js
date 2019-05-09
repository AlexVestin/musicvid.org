
import uuid from 'uuid/v4'
export default class SerializableObject {
    constructor() {
        this.__id = uuid(); 
        this.__automations = [];
        this.__controllers = {};
    }

    __addFolder = (gui, name, options = {}) => {

    }   
    
    serialize = () => {
        const obj = {};
        Object.keys(this.__controllers).forEach(key => {
            const c = this.__controllers[key]
            obj[key] = c.object[c.property];
        });
        return obj;
    }

    addController = (gui, object, name, options) => {
        const c = gui.add(object, name, options.min, options.max, options.step);
        const n = options.path ? options.path + ":" +  name : name;
        this.__controllers[n] = c;
        return c;
    }

    applyAutomation = (time, audioData) => {

    }
}