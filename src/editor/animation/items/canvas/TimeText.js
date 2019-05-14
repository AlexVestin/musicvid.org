
import Text from './Text'

export default class TimeText extends Text {
    constructor(info) {
        super(info);
        this.name = "TimeText";
    }

    formatTime = (seconds) => {
        let m = String(Math.floor((seconds % 3600) / 60));
        let s = String(seconds % 60).split(".")[0];
        const dec = String(seconds).split(".")[1];
    
        if (m.length === 1) m = "0" + m;
        if (s.length === 1) s = "0" + s;
    
        let formatted = m + ":" + s;
        if (dec) {
            formatted += "." + dec.substring(0, this.nrDecimals);
        }
    
        if(formatted.length === 5)
            formatted += ".00"
    
        return formatted;
    }

    setUpSubGUI (folder)  {
        this.textAlign = "left";
        this.nrDecimals = 2;
        this.addController(folder,this, "nrDecimals", {min: 0, step: 1});
    }


    getText = (time, audioData) => {
        return this.formatTime(time);
    }
}


