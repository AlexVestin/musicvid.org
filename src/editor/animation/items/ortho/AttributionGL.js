


import BaseItem from '../BaseItem'


export default class AttributionGL extends BaseItem {
    constructor(gl, width, height, text) {
        super();
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.height  = width;
        this.canvas.width  = height;

        this.text = ["Visuals by: ", text];
        this.fontSize = 55;
        this.positionX  = 0;
        this.positionY  = 0;
        this.updateText();
        this.initTexture(gl);
        
    }

    initTexture(gl) {
        this.texture = gl.createTexture();
        this.handleLoadedTexture(gl, this.texture, this.canvas);
    }
    
    handleLoadedTexture(gl,texture, textureCanvas) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas); // This is the important line!
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //gl.generateMipmap(gl.TEXTURE_2D);
    
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    updateText = () => {
        const {width,height} = this.canvas;
        this.ctx.clearRect(0,0,width, height);
        this.ctx.font = `${this.fontSize}px Arial`;
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.textAlign = "center";
        this.ctx.strokeStyle = 'black';
        this.text.forEach( (text, i) => {
            this.ctx.fillText(text, width/2, height / 2 + i * (this.fontSize+2));
            this.ctx.strokeText(text, width/2, height / 2 + i * (this.fontSize+2));
        })
    }
}


