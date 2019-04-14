
import Automation from './Automation'
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'

export default class AudioReactiveAutomation extends Automation {
    constructor(gui) {
        super(gui);
        this.type = "audio";
        this.name = "Audio Reactive Thing";
        this.folder = gui.addFolder("my folder");  
        this.impactAnalyser = new ImpactAnalyser(this.folder);
    }

    update = (time, audioData) => {
        this.value = this.impactAnalyser.analyse(audioData.frequencyData);
    }
}