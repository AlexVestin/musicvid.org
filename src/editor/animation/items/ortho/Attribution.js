


import * as THREE from "three";
import BaseItem from '../BaseItem'


export default class Attribution extends BaseItem {
    constructor(width, height) {
        super();
        this.canvas = document.createElement("canvas", {alpha: false});

        this.canvas.height  = width;
        this.canvas.width  = height;

        this.ctx = this.canvas.getContext("2d");


        this.fontSize = 25;
        this.positionX  = 0;
        this.positionY  = 0;
        this.text = [];
        
        this.tex = new THREE.CanvasTexture(this.canvas);
        this.mat = new THREE.MeshBasicMaterial({map: this.tex,transparent: true})

        //this.mat = new THREE.MeshBasicMaterial({map:tex, transparent: true});
        this.geo = new THREE.PlaneGeometry(2, 2*width/height);
        this.mesh = new THREE.Mesh(this.geo, this.mat);

        this.updateText();
    }

    setText = (text, x, y, options = {}) => {
        this.text = text;
        this.positionX = x;
        this.mesh.position.x = this.positionX;
        this.positionY = y;
        this.mesh.position.y = this.positionY;
        this.updateText();
    }

    updateText = () => {
        const {width,height} = this.canvas;
        this.ctx.clearRect(0,0,width, height);
        this.ctx.font = `${this.fontSize}px Arial`;
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.textAlign = "center";
        this.tex.needsUpdate = true;
        this.ctx.strokeStyle = 'black';
        this.text.forEach( (text, i) => {
            this.ctx.fillText(text, width/2, height / 2 + i * (this.fontSize+2));
            this.ctx.strokeText(text, width/2, height / 2 + i * (this.fontSize+2));
        })
       
    }

}


