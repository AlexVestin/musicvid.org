/**
 * @author meatbags / xavierburrow.com, github/meatbags
 *
 * RGB Halftone pass for three.js effects composer. Requires THREE.HalftoneShader.
 *
 */

import * as THREE from 'three'
import Pass from '../passtemplates/pass'
import HalftoneShader from '../shaders/halftoneshader'

export default class HalftonePass extends Pass {
    constructor ( config, fileConfig ) {
        super(config)

        const params = {
			shape: 1,
			radius: 4,
			rotateR: Math.PI / 12,
			rotateB: Math.PI / 12 * 2,
			rotateG: Math.PI / 12 * 3,
			scatter: 0,
			blending: 1,
			blendingMode: 1,
			greyscale: false,
			disable: false
        };


        if(!fileConfig) {
            this.config = {...this.config, ...params}
            this.config.defaultConfig.push({
                title: "Config",
                items: {
                    shape: {value: 1, type: "Number"},
                    radius: {type: "Number"},
                    rotateR: {type: "Number"},
                    rotateB:{type: "Number"},
                    rotateG: {type: "Number"},
                    scatter: {type: "Number"},
                    blending: {type: "Number"},
                    blendingMode: {type: "Number"},
                    greyscale: {type: "Boolean"},
                    disable: {type: "Boolean"}
                }
            })
            this.addEffect(this.config)
        }else {
            this.config = {...fileConfig}
        }
        
      
        this.config.type = config.type;
        this.uniforms = THREE.UniformsUtils.clone( HalftoneShader.uniforms );
        this.material = new THREE.ShaderMaterial( {
            uniforms: this.uniforms,
            fragmentShader: HalftoneShader.fragmentShader,
            vertexShader: HalftoneShader.vertexShader
        } );

        // set params
        this.uniforms.width.value = config.width;
        this.uniforms.height.value = config.height;

        for ( var key in params ) {
            if ( params.hasOwnProperty( key ) && this.uniforms.hasOwnProperty( key ) ) {
                this.uniforms[key].value = params[key];
            }
        }

        this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
        this.scene = new THREE.Scene();
        this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
        this.quad.frustumCulled = false;
        this.scene.add( this.quad );

    };

    edit = (key, value) => {
        this.config[key] = value;
        this.uniforms[key].value = value
    }

    render( renderer, writeBuffer, readBuffer, delta, maskActive ) {
        this.material.uniforms[ "tDiffuse" ].value = readBuffer.texture;
        this.quad.material = this.material;

        if ( this.renderToScreen ) {

            renderer.render( this.scene, this.camera );

       } else {

           renderer.render( this.scene, this.camera, writeBuffer, this.clear );

       }

    }

    setSize ( width, height ) {

        this.uniforms.width.value = width;
        this.uniforms.height.value = height;

    }
}