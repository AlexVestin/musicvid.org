import BaseItem from "../BaseItem";
import FSQuad from "../../postprocessing/passes/fullscreenquad";
import LineGenerator from "./LineGenerator";
import * as THREE from "three";

const vert = [
    "attribute vec3 position;",
    "attribute vec2 uv;",
    "uniform mat4 projectionMatrix;",
    "uniform mat4 modelViewMatrix;",
    "varying vec2 vUv;",
    "void main () {",
    "    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    "    vUv=uv;",
    "}"
].join("\n");

const frag = `precision highp float;
    uniform float opacity;
    uniform sampler2D tex;
    varying vec2 vUv;

    void  mainImage( out vec4,  vec2 fragCoord );
    void main () {
        vec4 col = texture2D(tex, vUv);
        if (length(col) > 0.00001) {
            col.a = opacity;
        } else {
            col = vec4(0., 0., 0., 0.);
        }


        gl_FragColor = col;
        
}`;

//https://tympanus.net/codrops/2019/01/08/animated-mesh-lines/
export default class ParticleLines extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Particle Lines";
        this.gui = info.gui;
        this.scene = info.scene;
        // Build an array of points
        this.lines = new LineGenerator();
        this.lines.start();

        this.updateSpeedAmplitude = 0.73;
        this.updateOpacity = 0.3;
        this.__attribution = {
            showAttribution: true,
            name: "Animated Mesh Lines",
            authors: [
                {
                    name: "Jeremboo",
                    social1: {
                        type: "github",
                        url: "https://github.com/Jeremboo"
                    }
                }
            ],
            projectUrl: "https://github.com/Jeremboo/animated-mesh-lines",
            description: "",
            license: this.LICENSE.REQUIRE_ATTRIBUTION,
            changeDisclaimer: true,
            imageUrl: ""
        };

        // Second pass
        this.scene = new THREE.Scene();
        this.width = info.width;
        this.height = info.height;
        this.setUpTarget();
      

        this.mat = new THREE.RawShaderMaterial({
            transparent: true,
            uniforms: {
                opacity: { value: 1.0 },
                tex: { value: this.target.texture }
            },
            vertexShader: vert,
            fragmentShader: frag
        });
        this.mesh = new FSQuad(this.mat);

        this.scene.add(this.lines);
        this.setUpFolder();
        //info.scene.add(this.mesh);
    }

    setUpTarget = () => {
        this.target = new THREE.WebGLRenderTarget(this.width, this.height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat
        });
    }

    dispose = () => {
        this.lines.dispose();
    };

    stop = () => {
        this.lines.stop();
    };

    play = () => {
        this.lines.start();
    };

    __setUpGUI = folder => {
        const spawn = folder.addFolder("Spawn Settings");
        this.addController(spawn, this.lines, "frequency", { min: 0, max: 1 });
        this.addController(spawn, this.lines, "taper", {
            values: ["linear", "none", "wavy"]
        });
        this.addController(spawn, this.lines, "turbulenceAmt");
        this.addController(spawn, this.lines, "nbrOfPoints", {
            step: 1,
            min: 0
        });
        this.addController(spawn, this.lines, "width", { min: 0, max: 20 });
        this.addController(spawn, this.lines, "getRandomColor", { min: 0 });
        this.addController(spawn, this.lines, "color", { color: true });
        this.addController(spawn, this.lines, "_scale", {
            min: 1,
            max: 100
        }).name("Scale");
        this.addController(spawn, this.lines, "nrPrecisionPoints", {
            min: 1,
            max: 1000,
            step: 1
        }).name("Sample rate");

        const direction = spawn.addFolder("Direction");
        this.addController(direction, this.lines, "directionXLower");
        this.addController(direction, this.lines, "directionXUpper");
        this.addController(direction, this.lines, "directionYLower");
        this.addController(direction, this.lines, "directionYUpper");
        this.addController(direction, this.lines, "directionZLower");
        this.addController(direction, this.lines, "directionZUpper");

        const origin = spawn.addFolder("Origin position");
        this.addController(origin, this.lines, "originX");
        this.addController(origin, this.lines, "originY");
        this.addController(origin, this.lines, "originZ");

        const length = spawn.addFolder("Length");
        this.addController(length, this.lines, "lengthLower", { min: 0 });
        this.addController(length, this.lines, "lengthUpper", { min: 0 });
        this.addController(length, this.lines, "lengthMult", { min: 0 });
        this.addController(length, this.lines, "visibleLengthLower", {
            min: 0
        });
        this.addController(length, this.lines, "visibleLengthUpper", {
            min: 0
        });
        this.addController(length, this.lines, "visibleLengthMult", { min: 0 });

        const speed = spawn.addFolder("Speed");
        this.addController(speed, this.lines, "speedLower", { min: 0 });
        this.addController(speed, this.lines, "speedUpper", { min: 0 });
        this.addController(speed, this.lines, "speedMult", { min: 0 });
        this.addController(folder, this, "updateSpeedAmplitude", { min: 0 });
        this.addController(folder, this.mat.uniforms.opacity, "value", { min: 0, max: 1.0 }).name("Opacity");
    };

    render = (renderer, camera) => {
        this.target.dispose();
        this.setUpTarget();
        this.mat.uniforms.tex.value = this.target.texture;
        renderer.setRenderTarget(this.target);

        renderer.render(this.scene, camera);
        renderer.setRenderTarget(null);
        this.mesh.render(renderer);
        
    };

    update = (time, dt, audioData) => {
        this.lines.update(
            this.updateSpeedAmplitude * dt * 60,
            this.updateOpacity
        );
    };
}
