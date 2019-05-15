
import Text from './Text'
export default class TextString extends Text {
    constructor(info) {
        super(info);
        this.name  = "TextString";
        
    }

    setText = (text, x, y, options) => {
        if(options.fontSize) this.fontSize = options.fontSize;
        if(options.textAlign) this.textAlign = options.textAlign;
        if(options.shadowBlur) this.shadowBlur = options.shadowBlur; 
        if(options.lineWidth) this.lineWidth = options.lineWidth; 
        this.text = text;
        this.positionX = x;
        this.positionY = y;
    }

    setUpSubGUI (folder) {
        this.text = "Example text";
        this.addController(folder,this, "text");
    };

    getText = (time, audioData) => {
        return this.text;
    }
}


