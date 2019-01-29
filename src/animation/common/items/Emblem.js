export default class Emblem {

    constructor(filePath) {
        this.image = new Image();
        this.image.onload = () => this.loaded = true;
        this.image.src = filePath;
    }

    draw = (ctx, canvas, currentRadius) => {
        if(this.loaded) {
            let xOffset = canvas.width / 2 - currentRadius;
            let yOffset = canvas.height / 2 - currentRadius;
            ctx.save();
            ctx.fillStyle = "#000000";
            let dimension = currentRadius * 2;
            ctx.drawImage(this.image, xOffset, yOffset, dimension, dimension);
            ctx.restore();
        }
    }
}