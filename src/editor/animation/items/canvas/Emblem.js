
export default class Emblem {

    constructor(filePath) {
        this.image = new Image();
        this.image.onload = () => this.loaded = true;
        this.image.src = filePath;
        this.emblemSizeScale = 0.9;
        this.circleSizeScale = 1.0;
        this.circleFillColor = "#FFF"
        this.shouldFillCircle = true;
        this.shouldClipImageToCircle = true;
        this.visible = true;
    }

    draw = (ctx, canvas, currentRadius) => {
        if(this.loaded && this.visible) {
            let dimension = currentRadius * 2 * this.emblemSizeScale;
            let xOffset = canvas.width / 2 - dimension / 2;
            let yOffset = canvas.height / 2 - dimension / 2;
            ctx.save();
            if(this.shouldFillCircle) {
                ctx.shadowBlur = 0;
                ctx.fillStyle =  this.circleFillColor;
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2, currentRadius * this.circleSizeScale, 0, Math.PI*2, true); 
                ctx.closePath();
                ctx.fill();
            }

            if(this.shouldClipImageToCircle) {
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2, dimension / 2, 0, Math.PI*2, true); 
                ctx.clip();
            }
           
            ctx.drawImage(this.image, xOffset, yOffset, dimension, dimension);
            ctx.restore();
        }
    }
}