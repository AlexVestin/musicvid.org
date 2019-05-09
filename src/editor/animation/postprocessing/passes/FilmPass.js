/**
 * @author alteredq / http://alteredqualia.com/
 */

import * as THREE from "three";
import Pass from "./pass";
import FilmShader from "../shaders/FilmShader";
import FullScreenQuad from "./fullscreenquad";

export default class FilmPass extends Pass {
    constructor(noiseIntensity, scanlinesIntensity, scanlinesCount, grayscale) {
        super();
        this.name = "Film pass";

        var shader = FilmShader;

        this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        });

        if (grayscale !== undefined) this.uniforms.grayscale.value = grayscale;
        if (noiseIntensity !== undefined)
            this.uniforms.nIntensity.value = noiseIntensity;
        if (scanlinesIntensity !== undefined)
            this.uniforms.sIntensity.value = scanlinesIntensity;
        if (scanlinesCount !== undefined)
            this.uniforms.sCount.value = scanlinesCount;

        this.fsQuad = new FullScreenQuad(this.material);
    }

    __setUpGUI = folder => {
        folder.add(this.uniforms.grayscale, "value").name("Grayscale");
        folder.add(this.uniforms.nIntensity, "value").name("nIntensity");
        folder.add(this.uniforms.sIntensity, "value").name("sIntensity");
        folder.add(this.uniforms.sCount, "value").name("sCount");
    };

    render = (renderer, writeBuffer, readBuffer, deltaTime, maskActive) => {
        this.uniforms["tDiffuse"].value = readBuffer.texture;
        this.uniforms["time"].value += deltaTime;

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
