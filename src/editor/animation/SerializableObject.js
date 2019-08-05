import uuid from "uuid/v4";
import { copyController } from '../dat.gui.src/gui/GUI'

export default class SerializableObject {
    constructor() {
        this.__id = uuid();
        this.__automations = [];
        this.__initialAutomations = [];
        this.__controllers = {};
    }
    __setControllerValues = (values, autos) => {
        let keysChanged = [];
        Object.keys(values).forEach(key => {
            const obj = values[key];
            const controller = this.__controllers[key];
            
            // Check if the controller exists, otherwise tell the user the internal id has changed
            if(!controller) {
                keysChanged.push(key);
            }else if(values[key].value !== undefined){
                controller.setValue(values[key].value);
                controller.updateDisplay();
            }

            if(values[key].value !== undefined) {
                if(obj.subcontrollers && obj.subcontrollers.length > 0) {
                    obj.subcontrollers.forEach(c => {
                        copyController({item: controller, location: c.location, name: c.name, initialLoad: true});
                    })
                }
            }
            
        });

        if(keysChanged.length > 0)
            alert(`${this.name}:${keysChanged.join(" ")} settings has changed internal id or does no longer exist`)


        if (autos) {
            this.__automations = autos;
            this.__initialAutomations = [...autos];
        }

    };

    __serializeControllers = () => {
        const obj = { controllers: {} };
        Object.keys(this.__controllers).forEach(key => {
            const c = this.__controllers[key];
            obj.controllers[key] = {};
            
            // Check if the controller has a value or is a function controller
            if (c.object[c.property] !== Object(c.object[c.property])) {
                obj.controllers[key].value = c.object[c.property];
            } 

            // Check if it has been added to the overview tab
            const subcontrollers  = c.__subControllers.map(e => {return { name: e.getName(), location: e.__location}});
            if(subcontrollers.length > 0) {
                obj.controllers[key].subcontrollers = subcontrollers;
            }
        });
        return obj;
    };

    serialize = () => {
        const obj = this.__serializeControllers();
        obj.__itemName = this.__itemName;
        obj.__automations = this.__automations;
        obj.name = this.name;
        obj.__startTime = this.startTime;
        obj.__endTime = this.__endTime;
        return obj;
    };

    reset = () => {
        this.__automations = [...this.__initialAutomations];
        Object.values(this.__controllers).forEach(controller => controller.reset());
    }

    addControllerWithMeta = (gui, object, name, params, meta) => {
        const c = gui.addWithMeta(object, name, {}, meta);
        const n = params.path ? params.path + ":" + name : name;
        c.__path = n;
        c.__parentObject = this;
        this.__controllers[n] = c;
        return c;
    }

    addController = (gui, object, name, arg1 = null, arg2 = null, arg3 = null) => {
        let options = {};
        if (arg2) {
            options.min = arg1;
            options.max = arg2;
            options.step = arg3;
        } else {
            options = arg1 || {};
        }
        let c;
        if (options.values) {
            c = gui.add(object, name, options.values);
        } else if (options.color) {
            c = gui.addColor(object, name);
            const f = gui.addFolder(c.__uuid, {useTitleRow: false});
            c.__colorControllers = f;
            c.__useHue = this.addController(f, c, "useHue", {path: name + "-useHue"}).onChange(c.enableUseHue);
            c.__hue = this.addController(f, c, "hue", {path: name + "-hue", min: 0, max: 360, colAuto: c}).onChange(c.setColor);
            c.__saturation = this.addController(f, c, "saturation", {path: name + "-saturation", min: 0, max: 1, colAuto: c}).onChange(c.setColor);
            c.__lightness = this.addController(f, c, "lightness", {path: name + "-lightness", min: 0, max: 1, colAuto: c}).onChange(c.setColor);

            c.__useRGB = this.addController(f, c, "useRGB", {path: name + "-useRGB"}).onChange(c.enableUseRGB);
            c.__red = this.addController(f, c, "red", {path: name + "-red", min: 0, max: 255, step: 1, colAuto: c}).onChange(c.setColor);
            c.__green = this.addController(f, c, "green", {path: name + "-green", min: 0, max: 255, step: 1, colAuto: c}).onChange(c.setColor);
            c.__blue = this.addController(f, c, "blue", {path: name + "-blue", min: 0, max: 255, step: 1, colAuto: c}).onChange(c.setColor);
            f.close();
            c.setControllerValues();
        } else {
            c = gui.add(object, name, options.min, options.max, options.step);
        }

        if (options.colAuto) {
            c.colorPropertyController = true;
            c.colorController = options.colAuto;
        }
        const n = options.path ? options.path + ":" + name : name;
        c.__path = n;
        c.__parentObject = this;
        c.__loadInfo = options.loadInfo;
        this.__controllers[n] = c;
        return c;
    };

    applyAutomations = active => {
        if (active) {
            const toRemove = [];
            const ca = {};
            for (var i = 0; i < this.__automations.length; i++) {
                const link = this.__automations[i];
                const automation = this.__gui.getRoot().__automations[
                    link.automationID
                ];
                if (!automation) {
                    toRemove.push(i);
                } else {
                    const controller = this.__controllers[link.controllerID];
                    ca[link.controllerID] = ca[link.controllerID] + 1 || 0;
                    automation.apply(
                        controller,
                        link,
                        0 === ca[link.controllerID]
                    );
                }
            }

            if (toRemove.length > 0) {
                const oldAutos = [...this.__automations];
                this.__automations = [];
                oldAutos.forEach((link, i) => {
                    if (!toRemove.includes(i)) this.__automations.push(link);
                });
            }

            Object.keys(ca).forEach(key => {
                const item = this.__controllers[key];
                if (
                    item.__updateCounter++ %
                        this.__gui.getRoot()
                            .__automationConfigUpdateFrequency ===
                    0
                ) {
                    item.updateDisplay();
                }
            });
        }
    };
}
