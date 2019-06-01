/**
 * @author alteredq / http://alteredqualia.com/
 */

import Pass from './pass'
import PixelShader from '../shaders/pixelshader'
import * as THREE from 'three' 
import FullScreenQuad from './fullscreenquad'
export default class PixelPass extends Pass  {

    constructor() {
        super();
        this.textureID = "tDiffuse";
        this.renderPass = false;
        this.uniforms = THREE.UniformsUtils.clone( PixelShader.uniforms );
        this.material = new THREE.ShaderMaterial( {
            defines: Object.assign( {}, PixelShader.defines ),
            uniforms: this.uniforms,
            vertexShader: PixelShader.vertexShader,
            fragmentShader: PixelShader.fragmentShader,
            transparent: true
        })

        this.material.uniforms.resolution.value = new THREE.Vector2(1280, 720);
        this.material.uniforms.resolution.value.multiplyScalar( window.devicePixelRatio );
        this.fsQuad = new FullScreenQuad(this.material);
    }
    __setUpGUI = folder => {
        this.addController(folder,this.uniforms.pixelSize, "value", {path: "pixelSize", min: 1, step: 1}).name("Pixel Size");
    }
       
    render( renderer, writeBuffer, readBuffer, delta, maskActive ) {
		if ( this.uniforms[ this.textureID ] ) {
			this.uniforms[ this.textureID ].value = readBuffer.texture;
		}
		this.fsQuad.material = this.material;

        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
            this.fsQuad.render(renderer);
        } else {
            renderer.setRenderTarget(writeBuffer);
            if (this.clear) renderer.clear();
            this.fsQuad.render(renderer);
        }
	}
}
