export default class Automation {

    constructor(rootGui) {
        
        this.__items = [];
        this.name = "";
        rootGui.__automations.push(this);
    }

    update(){ 
        alert("implement this"); }

    apply = () => {

        this.__items.forEach(item => {

        });
    }
}