import Pass from "./pass";
import DigitalGlitch from "../shaders/glitchshader";
import FullScreenQuad from './fullscreenquad'
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'
import * as THREE from "three";
/**
 * @author alteredq / http://alteredqualia.com/
 */

export default class GlitchPass extends Pass {
    constructor(dt_size) {
        super();

        this.name = "Glitch pass";
        this.TYPE = "GlitchPass";

        if (DigitalGlitch === undefined)
            console.error("THREE.GlitchPass relies on THREE.DigitalGlitch");

        var shader = DigitalGlitch;
        this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);

		if (dt_size === undefined) dt_size = 64;
		
		this.dt_size = dt_size;
		this.threshold = 0.24;
		this.randomTrigger = false;

        this.uniforms["tDisp"].value = this.generateHeightmap(dt_size);

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        });

        this.fsQuad = new FullScreenQuad(this.material);

        this.goWild = false;
        this.curF = 0;
        this.generateTrigger();
	}
	
	__setUpGUI = (folder) => {
        this.addController(folder, this, "dt_size").min(2).onChange(() => { this.uniforms["tDisp"].value = this.generateHeightmap(this.dt_size) });
        this.addController(folder, this, "threshold").min(0);
        this.addController(folder, this, "randomTrigger")

		this.impactAnalyser = new ImpactAnalyser(folder);
		this.impactAnalyser.endBin = 60;
		folder.updateDisplay();

	}

	update = (time, audioData) => {
		this.impact = this.impactAnalyser.analyse(audioData.frequencyData);
	}

    render = (renderer, writeBuffer, readBuffer, deltaTime, maskActive) => {
        this.uniforms["tDiffuse"].value = readBuffer.texture;
        this.uniforms["seed"].value = Math.random(); //default seeding
		this.uniforms["byp"].value = 0;
		

        if ( ((this.curF % this.randX === 0) && this.randomTrigger) || this.impact >= this.threshold) {
            this.uniforms["amount"].value = Math.random() / 30;
            this.uniforms["angle"].value = THREE.Math.randFloat(
                -Math.PI,
                Math.PI
            );
            this.uniforms["seed_x"].value = THREE.Math.randFloat(-1, 1);
            this.uniforms["seed_y"].value = THREE.Math.randFloat(-1, 1);
            this.uniforms["distortion_x"].value = THREE.Math.randFloat(0, 1);
            this.uniforms["distortion_y"].value = THREE.Math.randFloat(0, 1);
            this.curF = 0;
            this.generateTrigger();
        } else if (this.curF % this.randX < this.randX / 5 && this.randomTrigger) {
            this.uniforms["amount"].value = Math.random() / 90;
            this.uniforms["angle"].value = THREE.Math.randFloat(
                -Math.PI,
                Math.PI
            );
            this.uniforms["distortion_x"].value = THREE.Math.randFloat(0, 1);
            this.uniforms["distortion_y"].value = THREE.Math.randFloat(0, 1);
            this.uniforms["seed_x"].value = THREE.Math.randFloat(-0.3, 0.3);
            this.uniforms["seed_y"].value = THREE.Math.randFloat(-0.3, 0.3);
        } else if (this.goWild == false) {
            this.uniforms["byp"].value = 1;
        }

        this.curF++;

        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
            this.fsQuad.render(renderer);
        } else {
            renderer.setRenderTarget(writeBuffer);
            if (this.clear) renderer.clear();
            this.fsQuad.render(renderer);
        }
    };

    generateTrigger = () => {
        this.randX = THREE.Math.randInt(120, 240);
    };

    generateHeightmap = dt_size => {
        var data_arr = new Float32Array(dt_size * dt_size * 3);
        var length = dt_size * dt_size;

        for (var i = 0; i < length; i++) {
            var val = THREE.Math.randFloat(0, 1);
            data_arr[i * 3 + 0] = val;
            data_arr[i * 3 + 1] = val;
            data_arr[i * 3 + 2] = val;
        }

        var texture = new THREE.DataTexture(
            data_arr,
            dt_size,
            dt_size,
            THREE.RGBFormat,
            THREE.FloatType
        );
        texture.needsUpdate = true;
        return texture;
    };
}
