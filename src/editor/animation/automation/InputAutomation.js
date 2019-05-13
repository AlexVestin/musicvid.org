
import Automation from './Automation'
import mathjs from 'mathjs'

export default class InputAutomation extends Automation {
    constructor(gui) {
        super(gui);
        this.type = "math";
        this.name = "Math Input Thing";
        this.inputString = "sin(t)";
    }

    update = (time, audioData) => {
        try {
            this.value = mathjs.eval(this.inputString, {t: time});
        }catch(err) {
            console.log(err)
        } 
    }
}