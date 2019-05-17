
import BaseItem from '../BaseItem'
import fonts from 'editor/util/Fonts'
import  { addCanvasControls } from './CanvasControls'

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
        this.positionX = 0.5;
        this.positionY = 0.5;

        this.ctx.fontFamily = "Montserrat";
        this.ctx.fontSize = 30;
        this.ctx.textAlign ="center";
        this.ctx.globalAlpha = 1.0;
        this.ctx.fillStyle = "#FFFFFF";
        this.shouldDrawOutline = false;
        this.outlineShadowAlpha = 1.0;
        this.outlineShadowBlur = 5;
        this.outlineShadowColor = "#000000";
        this.outlineShadowLineWidth = 5;
        this.drawType  = "fillText";
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
        this.contextSettings = addCanvasControls(this, this.ctx, folder);     
        //addCanvasControls(this, this.ctx, folder, {fill: false, line: false });
        const ol = folder.addFolder("Outline")
        this.addController(folder, this, "drawType", {values: ["strokeText", "fillText"]});
        this.addController(folder, this, "positionX", -2, 2, 0.0001);
        this.addController(folder, this, "positionY", -2, 2, 0.0001);
        this.setUpSubGUI(folder);
        this.addController(ol, this, "shouldDrawOutline");
        this.addController(ol, this, "outlineShadowColor",{color:true} );
        this.addController(ol, this, "outlineShadowBlur", 0.0001, 50);
        this.addController(ol, this, "outlineShadowLineWidth", 0.000001, 30);

        return this.__addFolder(folder);
    };
    
    getText = () => {}

    update = (time, data) => { 
        
        this.contextSettings.apply(this.ctx);
        const text = this.getText(time, data);
        const { width,height } = this.canvas;
        const x = this.positionX * width;
        const y = this.positionY * height;
       
        if(this.shouldDrawOutline) {
            this.ctx.save();
            const col = hexToRgb(this.outlineShadowColor)
            this.ctx.shadowColor= `rgba(${col.r}, ${col.g}, ${col.b}, ${this.shadowAlpha})`;
            this.ctx.shadowBlur= this.outlineShadowBlur;
            this.ctx.lineWidth= this.outlineShadowLineWidth;
            this.ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${this.shadowAlpha})`;
            this.ctx.strokeText(text, x, y);
            this.ctx.restore();
        }

        this.ctx[this.drawType](text, x, y);
     };
}


