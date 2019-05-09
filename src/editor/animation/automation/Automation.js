import SerializableObject from '../SerializableObject'
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
    }

    update() {
        alert("implement this");
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
