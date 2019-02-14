
import * as THREE from "three";
import BaseItem from './BaseItem'

export default class Polartone extends BaseItem {
    constructor(info) {
        super();
        this.canvas = document.createElement("canvas");
        this.height  = 1024;
        this.width  = 1024;
        this.canvas.height  = this.height;
        this.canvas.width  = this.width;

        this.ctx = this.canvas.getContext("2d");

        this.amplitude = 1.0;
        this.extent = .1;
        this.distance = 2;
        this.positionX  = 0;
        this.positionY  = 0;
        this.textureScale = 1.0;
        this.aspect = info.width/info.height;

        
        this.prevArr = [];


        this.ctx.strokeStyle = "rgba(255, 0, 0, 0.64)"
        this.ctx.fillStyle = "#000000"
        
        this.ctx.shadowBlur = 40;
        this.ctx.shadowColor = "red";
        this.ctx.shadowOffsetX = 10;
        this.ctx.shadowOffsetY = 10;
        this.scale = 0.1;

        this.folder = this.setUpGUI(info.gui, "Polartone");
        const tex = new THREE.CanvasTexture(this.canvas);
        this.mat = new THREE.MeshBasicMaterial({map:tex, transparent: true});
        this.geo = new THREE.PlaneGeometry(2,2);
        this.mesh = new THREE.Mesh(this.geo, this.mat);
        info.scene.add(this.mesh);
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "amplitude");
        folder.add(this, "extent");
        folder.add(this, "distance");
        folder.add(this.ctx, "shadowBlur");
        folder.add(this.ctx, "shadowOffsetX");
        folder.add(this.ctx, "shadowOffsetY");
        folder.add(this.ctx, "globalAlpha");
        folder.add(this, "scale", -1.0, 1.0, 0.01).onChange(()=>this.mesh.scale.set(this.scale,this.scale,this.scale))


        folder.add(this, "positionX", -2, 2, 0.01).onChange(() => this.mesh.position.x = this.positionX);
        folder.add(this, "positionY", -2, 2, 0.01).onChange(() => this.mesh.position.y = this.positionY);
        folder.add(this, "textureScale", -2, 2, 0.01).onChange(() => this.mesh.scale.set(this.textureScale, this.textureScale, this.textureScale) );

        return folder;
    };

    update = (time, data) => {
        const {width,height} = this.canvas;
        this.ctx.clearRect(0,0,width,height);
        console.log(width, height);
        const audioData = data.timeData;
        let x = 0;
        this.ctx.beginPath();
        for(var i = 0; i < audioData.length; i++) {
            const amplitude = audioData[i]  * height * this.extent;
            const y =  Math.floor(height/2 + amplitude);
            if(i === 0) {     
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }            
            x += 1;
        }
        this.ctx.lineTo(width, height/2);
        this.ctx.closePath();
        this.ctx.stroke();
        this.mat.map.needsUpdate = true;
    };
}


