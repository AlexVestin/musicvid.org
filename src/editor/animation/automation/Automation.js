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

    apply = (item, type) => {
        switch (type) {
            case "*":
                item.object[item.property] =
                    item.preAutomationValue * this.value;
                break;
            case "=":
                item.object[item.property] = this.value;
                break;
            case "+":
                item.object[item.property] =
                    item.preAutomationValue + this.value;
                break;
            case "-":
                item.object[item.property] =
                    item.preAutomationValue - this.value;
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

        if (
            item.__updateCounter++ % this.rootGui.__automationConfigUpdateFrequency === 0
        )
            item.updateDisplay();
    };
}
