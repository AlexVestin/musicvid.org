
import BaseItem from '../BaseItem'
import fonts from 'editor/util/Fonts'

export default class Text extends BaseItem {
    constructor(info) {
        super(info);
        this.canvas = info.canvas;
        this.ctx = info.ctx;
        this.name = "Text";

        this.fontSize = 30;
        this.font = "Montserrat";
        this.aspect = info.width/info.height;
        this.text = "Example Text";
        this.textAlign ="center";
        this.positionX = 0.5;
        this.positionY = 0.5;
        this.globalAlpha = 1.0;
        this.fillStyle = "#FFFFFF";

        // SHADOWS
        this.shouldDrawShadow = false;
        this.shadowBlur = 5;
        this.shadowColor = "#000000";
        
        this.shadowLineWidth = 5;

        
        this.ctx.font = `normal ${this.fontSize}px ${this.font}`;

        this.__setUpFolder();
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
        folder.add(this, "positionX", 0, 1, 0.0001);
        folder.add(this, "positionY", 0, 1, 0.0001);
        folder.add(this, "font", fonts)
        folder.add(this, "fontSize", 0, 300)
        folder.add(this, "shouldDrawShadow");
        folder.addColor(this, "shadowColor");
        folder.add(this, "shadowBlur", 0, 50);
        folder.add(this, "shadowLineWidth", 0, 30);

        folder.add(this, "globalAlpha", 0, 1);

        folder.addColor(this, "fillStyle");
        return this.__addFolder(folder);
    };

    update = (time, data) => { 
        const {width,height} = this.canvas;
        const x = this.positionX * width;
        const y = this.positionY * height;
        this.ctx.font = `normal ${this.fontSize}px ${this.font}`;
        this.ctx.textAlign = this.textAlign; 
        if(this.shouldDrawShadow) {
            this.ctx.shadowColor=this.shadowColor;
            this.ctx.shadowBlur= this.shadowBlur;
            this.ctx.lineWidth= this.shadowLineWidth;
            this.ctx.strokeText(this.text, x, y);
        }
        this.ctx.shadowBlur = 0;        
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.globalAlpha = this.globalAlpha; 
           
        this.ctx.fillText(this.text, x, y);
     };
}


