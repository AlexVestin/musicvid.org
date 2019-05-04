
import uuid from 'uuid/v4'
export default class SerializableObject {
    constructor() {
        this.__id = uuid(); 
        this.__objectsToSerialize = [];
        this.__automations = [];
        this.__filesToLoad = [];

        this.__controllers = {};
    }


    __addFolder = (gui, name, options = {}) => {

    }   

    addController = (gui, object, name, options) => {
        const c = gui.add(object, name, options.min, options.max, options.step);
        const n = options.path ? options.path + ":" +  name : name;
        this.__controllers[n] = c;
        
    }

    applyAutomation = (time, audioData) => {

    }
}