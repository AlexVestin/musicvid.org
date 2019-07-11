
import Automation from './Automation'
import mathjs from 'mathjs'

export default class ColorAutomation extends Automation {
    constructor(gui) {
        super(gui);
        this.type = "color";
        this.name = "Color Automation";
        this.inputString = "sin(t)";
    }

    update = (time, audioData) => {
        try {
            this.value = mathjs.eval(this.inputString, {t: time});
        }catch(err) {
        } 
    }
}