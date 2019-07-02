
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
        this.color6 = "#FF0000";
        this.color7 = "#FF0000";
        this.setUpFolder();
    }

    updateFont = () => {
        this.ctx.font = `normal ${this.fontSize}px ${this.font}`;
    }

    __setUpGUI = (folder) => {
        this.addController(folder, this, "bpm", 0, 240);
        this.addController(folder, this, "duration", 0, 0.5);
        this.addController(folder, this, "timeSignatureDivider", [1,2,3,4,5,6,7]);
        this.addController(folder, this, "offset", 0, 1, 0.00001);
        this.colorFolder = folder.addFolder("colors");
        this.addController(this.colorFolder, this, "color1", {color: true});
        this.addController(this.colorFolder, this, "color2", {color: true});
        this.addController(this.colorFolder, this, "color3", {color: true});
        this.addController(this.colorFolder, this, "color4", {color: true});
        this.addController(this.colorFolder, this, "color5", {color: true});
        this.addController(this.colorFolder, this, "color6", {color: true});
        this.addController(this.colorFolder, this, "color7", {color: true});
        return this.__addFolder(folder);
    };
    update = (time, dt, data) => { 
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


