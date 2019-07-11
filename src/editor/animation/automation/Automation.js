import SerializableObject from '../SerializableObject'
import  { serializeObject } from '../Serialize'
import mathjs from 'mathjs'

export default class Automation extends SerializableObject {
    constructor(rootGui) {
        super();
        this.__items = [];
        this.name = "";
        this.value = 0;
        this.rootGui = rootGui;
        this.values = ["value"];
    }

    __setUpValues = (template) => {
        Object.assign(this, template);
        if(template.controllers) {
            this.__setControllerValues(template.controllers);
        }
    }

    update() {
        alert("implement this");
    }

    __serialize = () => {
        return serializeObject(this);
    }   

    stop = () => {}

    apply = (item, link, first=true, last=false) => {
        let val = item.preAutomationValue;
        const aVal = this[link.valueToUse] || this.value;

        if(!first) {
            val = item.object[item.property]; 
        }

        if(this.value === "NO_VALUE")
            return;

        const time = this.rootGui.__time;
        if(link.startTime && link.startTime > time)
            return

        if(link.endTime && link.endTime < time)
            return

        let v1 = 1;
        let t = link.type.trim();
        switch (t) {
            case "*":
                v1 = val * aVal;
                break;
            case "=":
                v1 = aVal;
                break;
            case "+":
                v1 = val + aVal;
                break;
            case "-":
                v1 = val - aVal;
                break;
            default:
            try {
                const v = mathjs.eval(t, {t: time, v: val, b: item.preAutomationValue, a: aVal});
                if(!isNaN(v)) {
                    v1 = v;
                }
            }catch(err) {
                // just pass
            }
        }

        if (v1 > item.__max)
           v1 = item.__max;

        if (v1 < item.__min)
            v1 = item.__min;

        
        if (item.colorPropertyController) {
            item.colorController.setColor();
        }
        item.object[item.property] = v1;
        if (item.__onChange) {
            item.__onChange();
        }

    };
}
