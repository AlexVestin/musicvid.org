import SerializableObject from '../SerializableObject'
import  { serializeObject } from '../Serialize'

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

    apply = (item, type, first=true, last=false) => {
        let val = item.preAutomationValue;
        if(!first) {
            val = item.object[item.property]; 
        }

        if(this.value === "NO_VALUE")
            return;

        switch (type) {
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
                console.log("Wrong type in automation");
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