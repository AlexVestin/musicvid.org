
import BaseItem from '../BaseItem'
import fonts from 'editor/util/Fonts'


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  

export default class Text extends BaseItem {
    constructor(info) {
        super(info);
        this.canvas = info.canvas;
        this.ctx = info.ctx;
        this.name = "Text";
        this.fontSize = 30;
        this.font = "Montserrat";
        
        this.textAlign ="center";
        this.positionX = 0.5;
        this.positionY = 0.5;
        this.globalAlpha = 1.0;
        this.fillStyle = "#FFFFFF";
        this.shouldDrawShadow = false;
        this.shadowAlpha = 1.0;
        this.shadowBlur = 5;
        this.shadowColor = "#000000";
        this.shadowLineWidth = 5;
        this.ctx.font = `normal ${this.fontSize}px ${this.font}`;
        this.setUpFolder();
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

    __setUpGUI = (folder) => {
        this.setUpSubGUI(folder);
        //addCanvasControls(this, this.ctx, folder, {fill: false, line: false });
        this.addController(folder,this, "positionX", -2, 2, 0.0001);
        this.addController(folder,this, "positionY", -2, 2, 0.0001);
        this.addController(folder,this, "font", {values: fonts })
        this.addController(folder,this, "fontSize", 0, 300)
        this.addController(folder,this, "shouldDrawShadow");
        this.addController(folder, this, "shadowColor",{color:true} );
        this.addController(folder,this, "shadowBlur", 0.0001, 50);
        this.addController(folder,this, "shadowLineWidth", 0.000001, 30);
        this.addController(folder,this, "globalAlpha", 0, 1);
        this.addController(folder, this, "fillStyle", {color:true});
        this.addController(folder, this, "textAlign", {values: ["center", "left", "right"]});
        return this.__addFolder(folder);
    };
    
    getText = () => {}

    update = (time, data) => { 

        const text = this.getText(time, data);

        this.ctx.globalAlpha = this.globalAlpha; 
        const {width,height} = this.canvas;
        const x = this.positionX * width;
        const y = this.positionY * height;
        this.ctx.font = `normal ${this.fontSize}px ${this.font}`;

        this.ctx.textAlign = this.textAlign; 
        if(this.shouldDrawShadow) {
            const col = hexToRgb(this.shadowColor)
            this.ctx.shadowColor= `rgba(${col.r}, ${col.g}, ${col.b}, ${this.shadowAlpha})`;
        
            this.ctx.shadowBlur= this.shadowBlur;
            this.ctx.lineWidth= this.shadowLineWidth;
            this.ctx.strokeText(text, x, y);
        }
        this.ctx.shadowBlur = 0;        
        this.ctx.fillStyle = this.fillStyle;
        
        this.ctx.fillText(text, x, y);
     };
}


