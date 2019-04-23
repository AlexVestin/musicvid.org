import {MeshBasicMaterial, Color, LinearFilter } from 'three';
import { loadImageTexture } from 'editor/util/ImageLoader';

export default class HexaGoneMaterial extends MeshBasicMaterial {

    constructor(item) {
        super({color: "red"})

        this.item = item;

        this.transparent = true;
        this._color = "#FF0000";
        this.color = new Color(this._color);
    }

    changeImage() {
        loadImageTexture(this, "setBackground");
    }

    setBackground = (texture) => {
        texture.minFilter = LinearFilter;
        texture.magFilter = LinearFilter;
        texture.generateMipMaps = false;
        this.map = texture;
        this.needsUpdate = true;
    }

    updateMaterial = (time, audioData) => { };

    __addUndoAction = (func, args) => {
        const item = {func: func, args: args, type: "action"};
        this.folder.getRoot().addUndoItem(item); 
    }
    

    __setUpGUI = (f) => {
        const folder = f;
        folder.addColor(this, "_color").name("Color").onChange(() => this.color = new Color(this._color));
        folder.add(this, "wireframe");
        folder.add(this, "changeImage");

        folder.updateDisplay();
        this.folder = folder;
        return folder;
    }
}