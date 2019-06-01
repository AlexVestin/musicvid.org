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
        this.type = "FilmPass";

        var shader = FilmShader;

        this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            transparent: true
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
        this.addController(folder,this.uniforms.grayscale, "value", {path: "grayscale"}).name("Grayscale");
        this.addController(folder,this.uniforms.nIntensity, "value", {path: "nIntensity"}).name("nIntensity");
        this.addController(folder,this.uniforms.sIntensity, "value", {path: "sIntensity"}).name("sIntensity");
        this.addController(folder,this.uniforms.sCount, "value", {path: "sCount"}).name("sCount");
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
