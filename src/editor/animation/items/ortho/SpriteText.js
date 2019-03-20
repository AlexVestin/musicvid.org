
import * as THREE from "three";
import BaseItem from '../BaseItem'
import { addOrthoMeshControls }  from 'editor/util/AddMeshControls'
import fonts from 'editor/util/Fonts'



export default class SpriteText extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Sprite Text";
        this.canvas = document.createElement("canvas");
        this.textureResolutionWidth = 1024;
        this.textureResolutionHeight = 512;

        this.canvas.height  = this.textureResolutionHeight;
        this.canvas.width  = this.textureResolutionWidth;

        this.ctx = this.canvas.getContext("2d");

        this.fontSize = 30;
        this.font = "Montserrat";
        this.positionX  = 0;
        this.positionY  = 0;
        this.textureScale = 1.0;
        this.ctx.fillStyle = "#FFFFFF";
        this.aspect = info.width/info.height;
        this.text = "Example Text";
        this.ctx.textAlign = "center";
        this.textAlign ="center";
        
        // SHADOWS
        this.shouldDrawShadow = true;
        this.shadowBlur = 12;
        this.lineWidth = 5;
        this.shadowColor = "#000000";
        
        this.tex = new THREE.CanvasTexture(this.canvas);
        this.mat = new THREE.MeshBasicMaterial({transparent: true, map: this.tex})

        //this.mat = new THREE.MeshBasicMaterial({map:tex, transparent: true});
        this.geo = new THREE.PlaneGeometry(2, this.aspect);
        this.mesh = new THREE.Mesh(this.geo, this.mat);
        this.mesh.scale.set(this.textureScale, this.textureScale, this.textureScale)

        this.updateText();
        info.scene.add(this.mesh);

        this.ctx.fillStyle = "#FFFFFF";
        this.__setUpFolder();
    }

    setText = (text, x, y, options) => {
        if(options.fontSize) this.fontSize = options.fontSize;
        if(options.textAlign) this.textAlign = options.textAlign;
        if(options.shadowBlur) this.shadowBlur = options.shadowBlur; 
        if(options.lineWidth) this.lineWidth = options.lineWidth; 

        


        this.text = text;
        this.positionX = x;
        this.mesh.position.x = this.positionX;
        this.positionY = y;
        this.mesh.position.y = this.positionY;
        this.updateText();
    }

    updateText = () => {
        const {width,height} = this.canvas;
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.ctx.font = `normal ${this.fontSize}px ${this.font}`;
        this.ctx.textAlign = this.textAlign;
        this.tex.needsUpdate = true;
        this.ctx.fillText(this.text, width/2, height / 2)
    }

    setSize = () => {
        this.canvas.width = Number(this.textureResolutionWidth);
        this.canvas.height = Number(this.textureResolutionHeight);
        this.updateText();
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "text").onChange(this.updateText);
        folder.add(this, "font", fonts).onChange(this.updateText);
        folder.add(this, "fontSize", 0, 300).onChange(this.updateText);

        folder.add(this, "shouldDrawShadow");
        folder.addColor(this, "shadowColor");
        folder.add(this, "lineWidth", 0, 30);

        folder.addColor(this.ctx, "fillStyle");
        addOrthoMeshControls(this, this.mesh, folder);
        return this.__addFolder(folder);
    };

    update = (time, data) => {  };
}


