import {MeshBasicMaterial, Color, LinearFilter } from 'three';
import { loadImageTexture } from 'editor/util/ImageLoader';

export default class HexaGoneMaterial extends MeshBasicMaterial {

    constructor(item) {
        super({color: "red"})

        this.item = item;

        this.transparent = true;
        this._color = "#FF0000";
        this.color = new Color(this._color);
        
        this.path = "material";
        this.__item = item;
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

    __setUpGUI = (folder) => {
        const i = this.__item;
        i.addController(folder, this, "_color", {color: true}).name("Color").onChange(() => this.color = new Color(this._color));;
        i.addController(folder, this, "wireframe");
        i.addController(folder, this, "changeImage");
        folder.updateDisplay();
        this.folder = folder;
        return folder;
    }
}