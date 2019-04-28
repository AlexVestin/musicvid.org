import Pass from "../passtemplates/pass";
import BokehShader from '../shaders/BokehShader';
import * as THREE from "three";
/**
 * Depth-of-field post-process with bokeh shader
 */

export default class BokehPass extends Pass {
    constructor(scene, camera, params) {
        super();
        this.scene = scene;
        this.camera = camera;

        var focus = params.focus !== undefined ? params.focus : 1.0;
        var aspect =
            params.aspect !== undefined ? params.aspect : camera.aspect;
        var aperture = params.aperture !== undefined ? params.aperture : 0.025;
        var maxblur = params.maxblur !== undefined ? params.maxblur : 1.0;

        // render targets

        var width = params.width || window.innerWidth || 1;
        var height = params.height || window.innerHeight || 1;

        this.renderTargetColor = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat
        });
        this.renderTargetColor.texture.name = "BokehPass.color";

        this.renderTargetDepth = this.renderTargetColor.clone();
        this.renderTargetDepth.texture.name = "BokehPass.depth";

        // depth material

        this.materialDepth = new THREE.MeshDepthMaterial();
        this.materialDepth.depthPacking = THREE.RGBADepthPacking;
        this.materialDepth.blending = THREE.NoBlending;

        // bokeh material

        if (BokehShader === undefined) {
            console.error("THREE.BokehPass relies on THREE.BokehShader");
        }

        var bokehShader = BokehShader;
        var bokehUniforms = THREE.UniformsUtils.clone(bokehShader.uniforms);

        bokehUniforms["tDepth"].value = this.renderTargetDepth.texture;

        bokehUniforms["focus"].value = focus;
        bokehUniforms["aspect"].value = aspect;
        bokehUniforms["aperture"].value = aperture;
        bokehUniforms["maxblur"].value = maxblur;
        bokehUniforms["nearClip"].value = camera.near;
        bokehUniforms["farClip"].value = camera.far;

        this.materialBokeh = new THREE.ShaderMaterial({
            defines: Object.assign({}, bokehShader.defines),
            uniforms: bokehUniforms,
            vertexShader: bokehShader.vertexShader,
            fragmentShader: bokehShader.fragmentShader
        });

        this.uniforms = bokehUniforms;
        this.needsSwap = false;

        this.fsQuad = new THREE.Pass.FullScreenQuad(this.materialBokeh);

        this.oldClearColor = new THREE.Color();
        this.oldClearAlpha = 1;
    }

    render = (renderer, writeBuffer, readBuffer, deltaTime, maskActive) => {
        // Render depth into texture

        this.scene.overrideMaterial = this.materialDepth;

        this.oldClearColor.copy(renderer.getClearColor());
        this.oldClearAlpha = renderer.getClearAlpha();
        var oldAutoClear = renderer.autoClear;
        renderer.autoClear = false;

        renderer.setClearColor(0xffffff);
        renderer.setClearAlpha(1.0);
        renderer.setRenderTarget(this.renderTargetDepth);
        renderer.clear();
        renderer.render(this.scene, this.camera);

        // Render bokeh composite

        this.uniforms["tColor"].value = readBuffer.texture;
        this.uniforms["nearClip"].value = this.camera.near;
        this.uniforms["farClip"].value = this.camera.far;

        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
            this.fsQuad.render(renderer);
        } else {
            renderer.setRenderTarget(writeBuffer);
            renderer.clear();
            this.fsQuad.render(renderer);
        }

        this.scene.overrideMaterial = null;
        renderer.setClearColor(this.oldClearColor);
        renderer.setClearAlpha(this.oldClearAlpha);
        renderer.autoClear = this.oldAutoClear;
    };
}
