import uuid from "uuid/v4";

export default class Automation {
    constructor(rootGui) {
        this.__id = uuid();
        this.__items = [];
        this.name = "";
        this.value = 0;
        rootGui.__automations.push(this);
        this.rootGui = rootGui;
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
            item.__updateCounter++ %
                this.rootGui.__automationConfigUpdateFrequency ===
            0
        )
            item.updateDisplay();
    };
}
