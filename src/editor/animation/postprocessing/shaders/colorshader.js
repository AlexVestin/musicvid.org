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

		"tDiffuse": { value: null },
        "targetColor": { value: new Vector3(0.2, 0.2, 0.2) },
        "amount": { value: 1.0 },
        "baseAmount" : {value: 10.0 }

	},

	vertexShader: [
		"varying vec2 vUv;",
		"void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [
        "uniform sampler2D tDiffuse;",
        "uniform vec3 targetColor;",
        "uniform float amount;",
        "uniform float baseAmount;",
        

		"varying vec2 vUv;",

		"void main() {",

			"vec4 color = texture2D( tDiffuse, vUv );",
            "float brighten = abs(targetColor.r - color.r) + abs(targetColor.g - color.g) +  abs(targetColor.b - color.b);",
            "color = color +  ( color * (brighten * baseAmount)) * amount;",

            "gl_FragColor = color;",

		"}"

	].join( "\n" )

};