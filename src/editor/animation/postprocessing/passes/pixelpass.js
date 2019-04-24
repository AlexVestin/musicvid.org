/**
 * @author alteredq / http://alteredqualia.com/
 */

import Pass from '../passtemplates/pass'
import PixelShader from '../shaders/pixelshader'
import * as THREE from 'three' 
export default class PixelPass extends Pass  {

    constructor(config, fileConfig) {
        super(config);
        this.textureID = "tDiffuse";
        this.renderPass = false;
        this.uniforms = THREE.UniformsUtils.clone( PixelShader.uniforms );
        this.material = new THREE.ShaderMaterial( {
            defines: Object.assign( {}, PixelShader.defines ),
            uniforms: this.uniforms,
            vertexShader: PixelShader.vertexShader,
            fragmentShader: PixelShader.fragmentShader
        })

        this.material.uniforms.resolution.value = new THREE.Vector2(config.width, config.height)
        this.material.uniforms.resolution.value.multiplyScalar( window.devicePixelRatio );
        this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
        this.scene = new THREE.Scene();

        this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
        this.quad.frustumCulled = false; // Avoid getting clipped
        this.scene.add( this.quad );


        if(!fileConfig) {
            this.config.pixelSize = 4;
            this.config.defaultConfig.push({
                title: "Pixel settings",
                items: {
                    pixelSize: {type: "Number", value: 4}
                }
            })
            this.addEffect(this.config)
        }else {
            this.config = {...fileConfig}
        }
        
        this.config.type = config.type
    }

    render( renderer, writeBuffer, readBuffer, delta, maskActive ) {
        this.material.uniforms.pixelSize.value = this.config.pixelSize;

		if ( this.uniforms[ this.textureID ] ) {
			this.uniforms[ this.textureID ].value = readBuffer.texture;
		}
		this.quad.material = this.material;
		if ( this.renderToScreen ) {
			renderer.render( this.scene, this.camera );
		} else {
			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}
}
