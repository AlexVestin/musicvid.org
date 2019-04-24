/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Sepia tone shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

import { Vector3 } from 'three' 

export default {

	uniforms: {
        "targetColor": { value: new Vector3(Math.random(), Math.random(), Math.random()) }
	},

	vertexShader: [
		"void main() {",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"

	].join( "\n" ),

	fragmentShader: [
        "uniform vec3 targetColor;",

		"void main() {",
            "gl_FragColor = vec4(targetColor, 1.0);",
		"}"

	].join( "\n" )

};