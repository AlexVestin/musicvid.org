import * as THREE from "three";
import { smooth, toWebAudioForm, getByteSpectrum } from 'audio/analyse_functions'

const vertexShader = [
    "attribute float scale;",
    "void main() {",
    "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
    "gl_PointSize = scale * ( 300.0 / - mvPosition.z );",
    "gl_Position = projectionMatrix * mvPosition;",
    "}"
].join("\n");

const fragmentShader = [
    "uniform vec3 color;",
    "void main() {",
    "if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;",
    "gl_FragColor = vec4( color, 1.0 );",
    "}"
].join("\n");

export default class PointBed {
    constructor(info) {
        var SEPARATION = 100;
        this.AMOUNTX = 16;
        this.AMOUNTY = 32;

        var numParticles = this.AMOUNTX * this.AMOUNTY;
        var positions = new Float32Array(numParticles * 3);
        var scales = new Float32Array(numParticles);
        var i = 0,
            j = 0;
        this.count = 0;
        this.prevArr = [];
        this.amplitude = 10;

        for (var ix = 0; ix < this.AMOUNTX; ix++) {
            for (var iy = 0; iy < this.AMOUNTY; iy++) {
                positions[i] =
                    ix * SEPARATION - (this.AMOUNTX * SEPARATION) / 2; // x
                positions[i + 1] = 0; // y
                positions[i + 2] =
                    iy * SEPARATION - (this.AMOUNTY * SEPARATION) / 2; // z
                scales[j] = 1;
                i += 3;
                j++;
            }
        }

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );
        geometry.addAttribute("scale", new THREE.BufferAttribute(scales, 1));
        var material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xffffff) }
            },
            vertexShader,
            fragmentShader
        });
        //
        this.particles = new THREE.Points(geometry, material);
        info.scene.add(this.particles);

        this.folder = this.setUpGUI(info.gui, "Polartone");
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "amplitude");
        return folder;
    };

    update = (time, data) => {
        const particles = this.particles;

        let waf = toWebAudioForm(data.frequencyData.slice(0, data.frequencyData.length /2), this.prevArr, 0.1);
        this.prevArr = waf;
        const freq = getByteSpectrum(waf).map(e => e / 10);

        var positions = particles.geometry.attributes.position.array;
        var scales = particles.geometry.attributes.scale.array;
        var i = 0,
            j = 0;

        for (var ix = 0; ix < this.AMOUNTX; ix++) {
            for (var iy = 0; iy < this.AMOUNTY; iy++) {
                positions[i + 1] = freq[j] * this.amplitude;
                /*
                    Math.sin((ix + this.count) * 0.3) * 50 +
                    Math.sin((iy + this.count) * 0.5) * 50;
                */
                scales[j] =
                    (Math.sin((ix + this.count) * 0.3) + 1) * 8 +
                    (Math.sin((iy + this.count) * 0.5) + 1) * 8;
                i += 3;
                j++;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.scale.needsUpdate = true;
        this.count += 0.1;
    };
}
