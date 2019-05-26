/**
 * @author alteredq / http://alteredqualia.com/
 */

import * as THREE from "three";
import Pass from "./pass";
import ConvolutionShader from '../shaders/convolutionshader';
import CopyShader from '../shaders/copyshader';
import FullScreenQuad from './fullscreenquad'


export default class BloomPass extends Pass {
    constructor(strength, kernelSize, sigma, resolution) {
        super();

        strength = strength !== undefined ? strength : 1;
        kernelSize = kernelSize !== undefined ? kernelSize : 25;
        sigma = sigma !== undefined ? sigma : 4.0;
        resolution = resolution !== undefined ? resolution : 256;

        this.blurX = new THREE.Vector2(0.001953125, 0.0);
        this.blurY = new THREE.Vector2(0.0, 0.001953125);

        // render targets

        var pars = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        };

        this.renderTargetX = new THREE.WebGLRenderTarget(
            resolution,
            resolution,
            pars
        );
        this.renderTargetX.texture.name = "BloomPass.x";
        this.renderTargetY = new THREE.WebGLRenderTarget(
            resolution,
            resolution,
            pars
        );
        this.renderTargetY.texture.name = "BloomPass.y";

        // copy material

        var copyShader = CopyShader;

        this.copyUniforms = THREE.UniformsUtils.clone(copyShader.uniforms);

        this.copyUniforms["opacity"].value = strength;

        this.materialCopy = new THREE.ShaderMaterial({
            uniforms: this.copyUniforms,
            vertexShader: copyShader.vertexShader,
            fragmentShader: copyShader.fragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        // convolution material

        if (ConvolutionShader === undefined)
            console.error("THREE.BloomPass relies on THREE.ConvolutionShader");

        var convolutionShader = ConvolutionShader;

        this.convolutionUniforms = THREE.UniformsUtils.clone(
            convolutionShader.uniforms
        );

        this.convolutionUniforms["uImageIncrement"].value =
            this.blurX;
        this.convolutionUniforms[
            "cKernel"
        ].value = ConvolutionShader.buildKernel(sigma);

        this.materialConvolution = new THREE.ShaderMaterial({
            uniforms: this.convolutionUniforms,
            vertexShader: convolutionShader.vertexShader,
            fragmentShader: convolutionShader.fragmentShader,
            defines: {
                KERNEL_SIZE_FLOAT: kernelSize.toFixed(1),
                KERNEL_SIZE_INT: kernelSize.toFixed(0)
            }
        });

        this.needsSwap = false;

        this.fsQuad = new FullScreenQuad(null);
    }

    render = (renderer, writeBuffer, readBuffer, deltaTime, maskActive) => {
        if (maskActive) renderer.context.disable(renderer.context.STENCIL_TEST);

        console.log(this.copyUniforms)

        // Render quad with blured scene into texture (convolution pass 1)

        this.fsQuad.material = this.materialConvolution;

        this.convolutionUniforms["tDiffuse"].value = readBuffer.texture;
        this.convolutionUniforms["uImageIncrement"].value =
            this.blurX;

        renderer.setRenderTarget(this.renderTargetX);
        renderer.clear();
        this.fsQuad.render(renderer);

        // Render quad with blured scene into texture (convolution pass 2)

        this.convolutionUniforms["tDiffuse"].value = this.renderTargetX.texture;
        this.convolutionUniforms["uImageIncrement"].value =
            this.blurY;

        renderer.setRenderTarget(this.renderTargetY);
        renderer.clear();
        this.fsQuad.render(renderer);

        // Render original scene with superimposed blur to texture

        this.fsQuad.material = this.materialCopy;

        this.copyUniforms["tDiffuse"].value = this.renderTargetY.texture;

        if (maskActive) renderer.context.enable(renderer.context.STENCIL_TEST);

        renderer.setRenderTarget(readBuffer);
        if (this.clear) renderer.clear();
        this.fsQuad.render(renderer);
    };
}
