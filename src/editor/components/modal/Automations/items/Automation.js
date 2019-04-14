import uuid from 'uuid/v4';

export default class Automation {

    constructor(rootGui) {
        this.__id = uuid();
        this.__items = [];
        this.name = "";
        this.value = 0;
        rootGui.__automations.push(this);
    }

    update(){ alert("implement this"); }

    apply = () => {
        this.__items.forEach(obj => {
            const {item, type} = obj;

            switch(type) {
                case "*":
                    item.object[item.property] = item.preAutomationValue * this.value;        
                    break;  
                case "=":
                    item.object[item.property] = this.value;
                    break;
                case "+":
                    item.object[item.property] = item.preAutomationValue + this.value;  
                    break;
                case "-":
                    item.object[item.property] = item.preAutomationValue - this.value;  
                    break;
                default:
                    console.log("Wrong type in automation");
            }
            item.updateDisplay();
        });
    }
}