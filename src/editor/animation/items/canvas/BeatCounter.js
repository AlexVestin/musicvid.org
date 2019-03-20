
import BaseItem from '../BaseItem'

export default class BeatCounter extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "BeatCounter";
        this.canvas = info.canvas;
        this.ctx = info.ctx;
        this.bpm = 128;
        this.duration = 0.1;
        this.timeSignatureDivider = 4;
        this.offset = 0;
        
        this.color1 = "#FF0000";
        this.color2 = "#00FF00";
        this.color3 = "#0000FF";
        this.color4 = "#FFFF00";
        this.color5 = "#00FFFF";
        this.color6= "#FF0000";
        this.color7 = "#FF0000";
        this.__setUpFolder();
    }

    updateFont = () => {
        this.ctx.font = `normal ${this.fontSize}px ${this.font}`;
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "bpm", 0, 240);
        folder.add(this, "duration", 0, 0.5);
        folder.add(this, "timeSignatureDivider", [1,2,3,4,5,6,7]);
        folder.add(this, "offset", 0, 1, 0.00001);
        this.colorsFolder = folder.addFolder("colors");
        this.colorsFolder.addColor(this, "color1");
        this.colorsFolder.addColor(this, "color2");
        this.colorsFolder.addColor(this, "color3");
        this.colorsFolder.addColor(this, "color4");
        this.colorsFolder.addColor(this, "color5");
        this.colorsFolder.addColor(this, "color6");
        this.colorsFolder.addColor(this, "color7");
        return this.__addFolder(folder);
    };
    update = (time, data) => { 
        const { width, height } =  this.canvas;
        const t = time + this.offset;
        const stepSize = (60 / this.bpm) * (4/this.timeSignatureDivider);
        const beatIndex = Math.floor(t / stepSize);  
        const restSum  = t % stepSize;
        if(restSum < this.duration) {
            this.ctx.fillStyle = this["color" + String(1 + beatIndex % this.timeSignatureDivider)];
            this.ctx.fillRect(0,0,width, height);
        }
     };
}


