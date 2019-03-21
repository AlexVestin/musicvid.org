
import BaseItem from '../BaseItem'
import { loadImage } from 'editor/util/ImageLoader';

export default class SImage extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Image";
        this.gui = info.gui;
        this.canvas = info.canvas;
        this.ctx = info.ctx;

        this.aspect = info.width/info.height;

        this.positionX = 0.5;
        this.positionY = 0.5;
        this.width = 0.1;
        this.height = 0.1;
        
        // SHADOWS
        this.shouldDrawShadow = true;
        this.shadowBlur = 12;
        this.shadowColor = "#000000";
        
        this.ctx.fillStyle = "#FFFFFF";
        this.image = new Image();
        this.prevImage = null;

        this.__setUpFolder();
    }

    setImage = (img) => {
        this.image = img;
    }

    undoLoadImage = (img) => {
        const ref = this.gui.__root.modalRef; 
        loadImage(ref, this.setImage);
    }

    loadNewImage() {
        const ref = this.gui.__root.modalRef; 
        loadImage(ref, this.setImage).then(file => {
            this.__addUndoAction(this.undoLoadImage, file);
            this.prevImage = file;
        });
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "loadNewImage");
        folder.add(this, "positionX");
        folder.add(this, "positionY");
        folder.add(this, "width");
        folder.add(this, "height");
        folder.add(this, "shouldDrawShadow");
        folder.addColor(this, "shadowColor");
        folder.addColor(this.ctx, "fillStyle");
        return this.__addFolder(folder);
    };

    update = (time, data) => { 
        const {width,height} = this.canvas;
        const x = this.positionX * width;
        const y = this.positionY * height;
        const w = this.width * width;
        const h = this.height * height * this.aspect;

        this.ctx.drawImage(this.image, x, y, w, h)
     };
}


