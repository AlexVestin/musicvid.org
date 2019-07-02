
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

        this.setUpFolder();
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
            this.prevImage = file;
        });
    }

    __setUpGUI = (folder) => {
        this.addController(folder, this, "loadNewImage");
        this.addController(folder, this, "positionX");
        this.addController(folder, this, "positionY");
        this.addController(folder, this, "width");
        this.addController(folder, this, "height");
        this.addController(folder, this, "shouldDrawShadow");
        this.addController(folder, this, "shadowColor", {color: true} );
        this.addController(folder, this.ctx, "fillStyle", {color: true} );
        return this.__addFolder(folder);
    };

    update = (time, dt, data) => { 
        const {width,height} = this.canvas;
        const x = this.positionX * width;
        const y = this.positionY * height;
        const w = this.width * width;
        const h = this.height * height * this.aspect;

        this.ctx.drawImage(this.image, x, y, w, h)
     };
}


