
import BaseItem from '../BaseItem'


const fonts = ["Montserrat", "Anton", "Carrois Gothic SC", "Arial", "Helvetica", "Times New Roman", "Times", "Courier New", "Courier", "Verdana", "Georgia", "Palatino", "Garamond", "Bookman", "Comic Sans MS"]



export default class Polartone extends BaseItem {
    constructor(info) {
        super();
        this.canvas = info.canvas;
        this.ctx = info.ctx;

        this.fontSize = 30;
        this.font = "Montserrat";
        this.aspect = info.width/info.height;
        this.text = "Example Text";
        this.textAlign ="center";
        this.positionX = 0.5;
        this.positionY = 0.5;
        
        // SHADOWS
        this.shouldDrawShadow = true;
        this.shadowBlur = 12;
        this.lineWidth = 5;
        this.shadowColor = "#000000";
        this.folder = this.setUpGUI(info.gui, "Polartone");

        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = `normal ${this.fontSize}px ${this.font}`;
    }

    updateFont = () => {
        this.ctx.font = `normal ${this.fontSize}px ${this.font}`;
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

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "text");
        folder.add(this, "positionX");
        folder.add(this, "positionY");
        folder.add(this, "font", fonts)
        folder.add(this, "fontSize", 0, 300)
        folder.add(this, "shouldDrawShadow");
        folder.addColor(this, "shadowColor");
        folder.add(this, "lineWidth", 0, 30);
        folder.addColor(this.ctx, "fillStyle");

        return folder;
    };

    update = (time, data) => { 
        const {width,height} = this.canvas;
        const x = this.positionX * width;
        const y = this.positionY * height;
        this.ctx.font = `normal ${this.fontSize}px ${this.font}`;
        this.ctx.textAlign = this.textAlign;    
        this.ctx.fillText(this.text, x, y)
     };
}


