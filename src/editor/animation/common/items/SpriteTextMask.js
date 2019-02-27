
import * as THREE from "three";
import BaseItem from './BaseItem'
import addMeshControls from '../../../util/AddMeshControls'


const fonts = ["Arial", "Helvetica", "Times New Roman", "Times", "Courier New", "Courier", "Verdana", "Georgia", "Palatino", "Garamond", "Bookman", "Comic Sans MS"]


const vertexShader = [
    "varying vec2 vUv;",
    "void main() {",
        "vUv = uv;",
        "gl_Position =   projectionMatrix * modelViewMatrix * vec4(position,1.0);",
    "}",
].join("\n");

const fragmentShader = [
    "uniform sampler2D texture1;",
    "varying vec2 vUv;",

    "void main() {",
        "vec4 c = texture2D(texture1, vUv);",
        "float alpha = 0.;",
        "if(length(c.rgb) < 0.5)",
            "alpha = 1.0 - length(c.rgb) * 2.;",
            
        "gl_FragColor = vec4(0.0,0.,0., alpha);",
    "}"
].join("\n");


export default class Polartone extends BaseItem {
    constructor(info) {
        super();
        this.canvas = document.createElement("canvas");
        this.textureResolutionWidth = 1024;
        this.textureResolutionHeight = 1024;

        this.canvas.height  = this.textureResolutionHeight;
        this.canvas.width  = this.textureResolutionWidth;

        this.ctx = this.canvas.getContext("2d");

        this.fontSize = 150;
        this.font = "Arial";
        this.ctx.fillStyle = "#FFFFFF";
        this.aspect = info.width/info.height;
        this.text = "Example Text";
        this.ctx.textAlign = "center";

        
        this.tex = new THREE.CanvasTexture(this.canvas);
        this.mat = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            uniforms: {
                texture1: { value: this.tex }
            }
        })

        //this.mat = new THREE.MeshBasicMaterial({map:tex, transparent: true});
        this.geo = new THREE.PlaneGeometry(2,2 * this.aspect);
        this.mesh = new THREE.Mesh(this.geo, this.mat);
        this.folder = this.setUpGUI(info.gui, "Polartone");

        this.updateText();
        info.scene.add(this.mesh);
        this.ctx.fillStyle = "#FFFFFF";
    }

    updateText = () => {
        const {width,height} = this.canvas;
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.ctx.font = `${this.fontSize}px ${this.font}`;
        this.ctx.textAlign = "center";
        this.tex.needsUpdate = true;
        this.ctx.fillText(this.text, width/2, height / 2);
        this.ctx.fillText("OUT NOW", width/2, height / 2 + 150);
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
        addMeshControls(this, this.mesh, folder);
        return folder;
    };

    update = (time, data) => {  };
}


