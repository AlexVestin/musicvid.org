
import BaseItem from '../BaseItem'


const fonts = ["Montserrat", "Anton", "Carrois Gothic SC", "Arial", "Helvetica", "Times New Roman", "Times", "Courier New", "Courier", "Verdana", "Georgia", "Palatino", "Garamond", "Bookman", "Comic Sans MS"]



export default class TextBar extends BaseItem {
    constructor(info) {
        super(info);
        this.name ="MonsterText";
        this.canvas = info.canvas;
        this.ctx = info.ctx;
        this.aspect = info.width/info.height;

        this.font = "Montserrat";
        this.mainFontSize = 80;
    
        
        this.firstRow = "Artist";
        this.secondRow = "Song";
        this.thirdRow = "Remix";
        this.useThirdRow = false;

        
        
        this.textAlign ="center";
        this.positionX = 0.5;
        this.positionY = 0.5;
        
        // SHADOWS
        this.shouldDrawShadow = true;
        this.shadowBlur = 12;
        this.lineWidth = 5;
        this.shadowColor = "#000000";
        this.folder = this.setUpGUI(info.gui, "Text");

        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = `normal ${this.fontSize}px ${this.font}`;
        this.__setUpFolder();
    }

    updateFont = () => {
        this.ctx.font = `normal ${this.fontSize}px ${this.font}`;
    }

    setText = (text, x, y, options) => {
        Object.assign(this, options);
        this.text = text;
        this.positionX = x;
        this.positionY = y;
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "firstRow");
        folder.add(this, "secondRow");
        folder.add(this, "useThirdRow");
        folder.add(this, "thirdRow");
        

        folder.add(this, "font", fonts)
        folder.add(this, "fontSize", 0, 300)
        folder.add(this, "shouldDrawShadow");
        folder.addColor(this, "shadowColor");
        folder.add(this, "lineWidth", 0, 30);
        folder.addColor(this.ctx, "fillStyle");
        return this.__addFolder(folder);
    };

    

    update = (time, data, shouldIncrement) => { 

        this.ctx.font = `normal ${this.fontSize}px ${this.font}`;
        this.ctx.textAlign = this.textAlign;    
        const {width,height} = this.canvas;
        const x = this.positionX * width;
        const y = this.positionY * height;
        this.ctx.fillText(this.text, x, y)

     };
}


