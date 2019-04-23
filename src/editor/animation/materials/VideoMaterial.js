import * as THREE from 'three';
import { loadVideoTexture } from 'editor/util/ImageLoader';


export default class ImageMaterial extends THREE.VideoTexture{

    constructor(undoAction) {
        super()
        this.transparent = true;

        const url = "./img/space.jpeg";
        this.prevFile = url;
        const tex = new THREE.Texture();
        this.setBackground(tex);
    }

    update = (impact) => {
        this.uniforms.vignette_amt.value = this.vignetteAmount + impact * -this.brightenMultipler;
    }

    changeImage() {
        loadImageTexture(this, "setBackground");
    }

    setBackground = (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipMaps = false;
        this.uniforms.texture1.value = texture;
        this.needsUpdate = true;
    }

    __addUndoAction = (func, args) => {
        const item = {func: func, args: args, type: "action"};
        this.folder.getRoot().addUndoItem(item); 
    }
    
    setUpGUI = (f) => {
        const folder = f; 
        folder.add(this, "changeImage");
        folder.add(this.uniforms.enablePostProcessing, "value").name("Enable Postprocessing");
        folder.add(this, "brightenToAudio");
        folder.add(this, "brightenMultipler");           
        folder.add(this.uniforms.opacity, "value").name("opacity");
        folder.add(this, "vignetteAmount").onChange(() => this.uniforms.value = this.vignetteAmount);
        folder.add(this.uniforms.should_mirror, "value", {name: "Mirror image"});
        this.folder = f;
    }
}