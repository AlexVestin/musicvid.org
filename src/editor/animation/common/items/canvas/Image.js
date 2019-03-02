
import BaseItem from '../BaseItem'

export default class Polartone extends BaseItem {
    constructor(info) {
        super();
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
        this.folder = this.setUpGUI(info.gui, "Polartone");
        this.ctx.fillStyle = "#FFFFFF";
        this.image = new Image();
    }

    async loadNewImage() {
        const ref = this.folder.__root.modalRef; 
        if(ref.currentPromise && !ref.currentPromise.done) {
            await ref.currentPromise;
        }

        ref.toggleModal(3).then(this.imageLoaded)
    }

    imageLoaded = (image) => {
        const fr = new FileReader();
        
        fr.onload =  () => {
            this.image.src = fr.result;
        }
        fr.readAsDataURL(image);
    }



    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "positionX");
        folder.add(this, "positionY");
        folder.add(this, "width");
        folder.add(this, "height");


        folder.add(this, "shouldDrawShadow");
        folder.addColor(this, "shadowColor");
        folder.addColor(this.ctx, "fillStyle");
        return folder;
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


