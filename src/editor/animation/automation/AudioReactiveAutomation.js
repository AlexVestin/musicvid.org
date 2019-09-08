
import Automation from './Automation'
import ImpactAnalyser from '../audio/ImpactAnalyser'

export default class AudioReactiveAutomation extends Automation {
    constructor(gui) {
        super(gui);
        this.type = "audio";
        this.name = "Audio Impact Automation";
        this.folder = gui.addFolder("Audio impact analyser", {useTitleRow: false}); 
        this.folder.open(); 
        this.impactAnalyser = new ImpactAnalyser(this.folder, this, true);
    }

    __serialize = () => {
        const obj = this.__serializeControllers();
        obj.type = this.type;
        obj.name = this.name;
        obj.__id = this.__id;
        return obj;
    }

    update = (time, audioData) => {
        this.value = this.impactAnalyser.analyse(audioData.frequencyData);
    }
}