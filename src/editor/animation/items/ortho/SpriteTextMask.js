
import * as THREE from "three";
import BaseItem from '../BaseItem'
import { addOrthoMeshControls } from 'editor/util/AddMeshControls'
import fonts from 'editor/util/Fonts'
import { loadImageTexture } from 'editor/util/ImageLoader';



const vertexShader = [
    "varying vec2 vUv;",
    "void main() {",
        "vUv = uv;",
        "gl_Position =   projectionMatrix * modelViewMatrix * vec4(position,1.0);",
    "}",
].join("\n");

const fragmentShader = [
    "uniform sampler2D texture1;",
    "uniform sampler2D texture2;",
    "varying vec2 vUv;",

    "void main() {",
        "vec4 c = texture2D(texture1, vUv);",
        "float alpha = 0.;",
        "if(length(c.rgb) < 0.5)",
            "alpha = 1.0 - length(c.rgb) * 2.;",
            
        "gl_FragColor = vec4(texture2D(texture2, vUv).rgb, alpha);",
    "}"
].join("\n");


export default class SpriteTextMask extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Sprite Text Mask";
        this.canvas = document.createElement("canvas");
        this.textureResolutionWidth = 1024;
        this.textureResolutionHeight = 1024;

        this.canvas.height  = this.textureResolutionHeight;
        this.canvas.width  = this.textureResolutionWidth;

        this.ctx = this.canvas.getContext("2d");

        this.fontSize = 150;
        this.font = "Montserrat";
        this.ctx.fillStyle = "#FFFFFF";
        this.aspect = info.width/info.height;


        
        this.topText = "Example Text";
        this.topTextX = 1.0;
        this.topTextY = 1.0;
        this.topFontSize = 150;

        
        this.bottomText = "Example Text";
        this.botTextX = 1.0;
        this.botTextY = 1.3;
        this.botFontSize  = 120;

        this.ctx.textAlign = "center";

        this.backgroundTex = new THREE.Texture();
        
        this.tex = new THREE.CanvasTexture(this.canvas);
        this.mat = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            uniforms: {
                texture1: { value: this.tex },
                texture2: { value: null, type: "t"},
            }
        })

        //this.mat = new THREE.MeshBasicMaterial({map:tex, transparent: true});
        this.geo = new THREE.PlaneGeometry(2,2 * this.aspect);
        this.mesh = new THREE.Mesh(this.geo, this.mat);
        this.__setUpFolder();

        const scale = 0.46;
        this.mesh.scale.set(scale, scale, scale);

        this.updateText();
        info.scene.add(this.mesh);
        this.ctx.fillStyle = "#FFFFFF";
    }

    setBackground = (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipMaps = false;
        this.mat.uniforms.texture2.value = texture;
        this.mat.needsUpdate = true;
    }
    
    changeBackroundImage = () => {
        loadImageTexture(this, "setBackground");
    }

    updateText = () => {
        const {width,height} = this.canvas;
        this.ctx.clearRect(0,0,width, height);
        
        this.ctx.textAlign = "center";
        this.tex.needsUpdate = true;

        this.ctx.font = `${this.topFontSize}px ${this.font}`;
        this.ctx.fillText(this.topText, this.topTextX*(width/2), this.topTextY * height / 2);
        this.ctx.font = `${this.botFontSize}px ${this.font}`;
        this.ctx.fillText(this.bottomText,  this.botTextX*(width/2), this.botTextY * height / 2);
    }

    setSize = () => {
        this.canvas.width = Number(this.textureResolutionWidth);
        this.canvas.height = Number(this.textureResolutionHeight);
        this.updateText();
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "changeBackroundImage");
        folder.add(this, "topText").onChange(this.updateText);
        folder.add(this, "topFontSize").onChange(this.updateText);
        folder.add(this, "topTextX", -2, 2).onChange(this.updateText);
        folder.add(this, "topTextY", -2, 2).onChange(this.updateText);
        
        folder.add(this, "bottomText").onChange(this.updateText);
        folder.add(this, "botFontSize").onChange(this.updateText);
        folder.add(this, "botTextX", -2, 2).onChange(this.updateText);
        folder.add(this, "botTextY", -2, 2).onChange(this.updateText);


        folder.add(this, "font", fonts).onChange(this.updateText);
        folder.add(this, "fontSize", 0, 300).onChange(this.updateText);
        addOrthoMeshControls(this, this.mesh, folder);
        return this.__addFolder(folder);
    };

    update = (time, data) => {  };
}


