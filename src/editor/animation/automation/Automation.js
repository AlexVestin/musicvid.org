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

    apply = (item, link, first=true, last=false) => {
        let val = item.preAutomationValue;
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

        let t = link.type.trim();
        switch (t) {
            case "*":
                item.object[item.property] = val * this.value;
                break;
            case "=":
                item.object[item.property] = this.value;
                break;
            case "+":
                item.object[item.property] = val + this.value;
                break;
            case "-":
                item.object[item.property] = val - this.value;
                break;
            default:
            try {
                const v = mathjs.eval(t, {t: time, v: val, b: item.preAutomationValue, a: this.value});
                if(!isNaN(v)) {
                    item.object[item.property] = v;
                }
            }catch(err) {

            }
        }

        if (item.object[item.property] > item.__max)
            item.object[item.property] = item.__max;

        if (item.object[item.property] < item.__min)
            item.object[item.property] = item.__min;

        if (item.__onChange) {
            item.__onChange();
        }

    };
}
