/**
 * @author alteredq / http://alteredqualia.com/
 */

import * as THREE from "three";
import Pass from "./pass";
import HorizontalBlurShader from "../shaders/HorizontalBlurShader";
import VerticalBlurShader from "../shaders/VerticalBlurShader";

import FullScreenQuad from "./fullscreenquad";

export default class FilmPass extends Pass {
    constructor() {
        super();
        this.name = "Blur pass";
        this.type = "BlurPass";

        var shader = HorizontalBlurShader;

        this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            transparent: true
        });


        this.fsQuad = new FullScreenQuad(this.material);
    }

    __setUpGUI = folder => {
        this.addController(folder,this.uniforms.amount, "value", {path: "amount"}).name("Amount");
    };

    render = (renderer, writeBuffer, readBuffer, deltaTime, maskActive) => {
        this.uniforms["tDiffuse"].value = readBuffer.texture;

        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
            this.fsQuad.render(renderer);
        } else {
            renderer.setRenderTarget(writeBuffer);
            if (this.clear) renderer.clear();
            this.fsQuad.render(renderer);
        }
    };
}
