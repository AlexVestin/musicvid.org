import * as THREE from 'three';
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'
import BaseItem from '../BaseItem'
import { loadImageTexture } from 'editor/util/ImageLoader';


/**
 * My Extension of js.nation
 *
 *  Copyright @caseif https://github.com/caseif/js.nation
 * @license GPL-3.0
 */



const vertShader =
    `attribute float size;
    attribute float alpha;
    uniform vec3 color; 
    varying float vAlpha; 
    varying vec3 vColor; 
    void main() { 
        vColor = color; 
        vAlpha = alpha; 
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); 
        gl_PointSize = 100.0 * size / length(mvPosition.xyz); 
        gl_Position = projectionMatrix * mvPosition; 
    }`;

const fragShader =
    `uniform sampler2D texture; 
    uniform bool flipY;
    varying float vAlpha; 
    varying vec3 vColor; 
    void main() { 
        gl_FragColor = vec4(vColor, vAlpha); 
        if(flipY)
            gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord); 
        else 
            gl_FragColor = gl_FragColor * texture2D(texture, 1.-gl_PointCoord); 

    }`;


class ParticleData {
    constructor(trajectory, speed, phaseAmp, phaseSpeed) {
        this.trajectory = trajectory; // the unit vector representing the trajectory of the particle
        this.speed = speed; // the speed multiplier of the particle
        this.phaseAmp = phaseAmp; // the amplitude of the particle's phase
        this.phaseSpeed = phaseSpeed; // the speed of the particle's phase
        this.phase = new THREE.Vector2(); // the current phase of the particle
    }

    getTrajectory = () => this.trajectory;
    getSpeed = () => this.speed;
    getPhaseAmplitude = () => this.phaseAmp;
    getPhaseSpeed = () => this.phaseSpeed;
    getPhase = () => this.phase;
    augmentPhase = (stepX, stepY) => {
        this.phase.x = (this.phase.x + stepX) % 1;
        this.phase.y = (this.phase.y + stepY) % 1;
    }
}

export default class Particles extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Particles";
        this.maxParticleCount = 1200; // particle count at 1080p
        this.particleMaxSpawnRate = 8; // max particles to spawn each frame. this takes effect during particle initlzn.
        this.particleOpacityMin = 0.9;
        this.particleOpacityMax = 1;
        this.particleSizeMin = 8;
        this.particleSizeMax = 13;
        this.cameraZPlane = 200; // the z-plane on which to place the camera
        this.particleDespawnBuffer = 0; // distance from the camera z-plane before despawning particles
        this.particleRadiusMin = 10; // the minimum radius of the particle cone at the z-plane intersecting the camera
        this.particleRadiusMax = 120; // the maximum radius of the particle cone at the z-plane intersecting the camera
        this.particleMinSpeed = 0.15;
        this.particleSpeedMultMin = 1.1;
        this.particleSpeedMultMax = 1.45;
        // The min/max phase speed a particle may be assigned. This is a property of each particle and does not change.
        this.particlePhaseSpeedMin = 0.1;
        this.particlePhaseSpeedMax = 0.25;
        // The min/max phase amplitude a particle may be assigned. This is a property of each particle and does not change.
        this.particlePhaseAmplitudeMin = 0.05;
        this.particlePhaseAmplitudeMax = 0.4;
        // The min/max to normalize the particle phase speed multiplier to.
        this.particlePhaseSpeedMultMin = 0.025;
        this.particlePhaseSpeedMultMax = 0.4;
        // The min/max to normalize the particle phase amplitude multiplier to.
        this.particlePhaseAmplitudeMultMin = 0.1;
        this.particlePhaseAmplitudeMultMax = 1;
        this.sizeMult = 1.0;
        this.VERTEX_SIZE = 3;
        this.scene = info.scene;
        this.particleData = [];
        this.baseSizes = [];
        this.color = 0xFFFFFF;
        this.baseSpeed = 1.0;
        this.movementAmplitude = 1.0;
        this.useCustomParticleImage = false;

        
        
       
      
       

        this.texLoader = new THREE.TextureLoader();
        this.texLoader.crossOrigin = "";
        this.setUp();

        
        this.__setUpFolder();
        this.folder.updateDisplay();

        this.impactAnalyser = new ImpactAnalyser(this.folder); 
        this.impactAnalyser.amplitude = 2.5;
        this.impactAnalyser.endBin = 80;
        this.impactAnalyser.deltaDecay = 0.3;
        this.__attribution = {
            showAttribution: true,
            name:"Particles",
            authors: [
                {
                    name: "caseif", 
                    social1: {type: "website", url: "https://caseif.net/"},
                    social2: {type: "github", url: "https://github.com/caseif"},
                },
                {
                    name: "Incept", 
                    social1: {type: "youtube", url: "https://www.youtube.com/channel/UCS12_l2kLigIPaXjRRmbdNA"},
                    social2: {type: "github", url: "https://github.com/itsIncept"},

                }
            ],
            projectUrl: "https://github.com/caseif/js.nation",
            description: "",
            license: this.LICENSE.REQUIRE_ATTRIBUTION,
            changeDisclaimer: true,
            //TODO change image
            imageUrl: "img/templates/JSNation.png"
        }
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "changeParticleImage");
        folder.add(this, "resetParticleImage");
        folder.add(this.pMaterial.uniforms.flipY, "value").name("Flip vertically")

        
        folder.add(this, "maxParticleCount", 0, 5000).onChange(() => this.initializeParticles())
        folder.addColor(this, "color").onChange(this.changeColor);
        folder.add(this, "particleMinSpeed", 0, 10);
        folder.add(this, "baseSpeed", 0, 10);
        
        folder.add(this, "movementAmplitude");
        folder.add(this, "sizeMult", 0, 5.0, 0.01).onChange(() => this.updateSizes());
        return this.__addFolder(folder);
    }

    changeColor = () => {
        this.pMaterial.uniforms.color.value = new THREE.Color(this.color)
    }

    get mesh() {
        return this.particleSystem;
    }

    changeParticleImage() {
        loadImageTexture(this, "setParticleImage");
    }
    
    setParticleImage = (tex) => {
        tex.minFilter = THREE.LinearFilter;
        this.pMaterial.uniforms.texture.value = tex;
    }

    resetParticleImage() {
        const texLoc = "./img/particle.png";
        const particleTexture = this.texLoader.load(texLoc);
        this.setParticleImage(particleTexture);
    }

    setUp = ()  => {
        this.particlesGeom = new THREE.BufferGeometry();
       
        let uniforms = {
            color: { type: "c", value: new THREE.Color(0xFFFFFF)},
            texture: { type: "t", value: new THREE.Texture() },
            flipY: { value: false}
        };

        this.pMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertShader,
            fragmentShader: fragShader,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false
        });

        this.resetParticleImage();
        this.initializeParticles();
        
        this.scene.add(this.particleSystem);
    }

    update = function(time, audioData) {

        if(this.particleSystem) {
            const multiplier = this.impactAnalyser.analyse(audioData.frequencyData) * this.movementAmplitude;
            for (let i = 0; i < this.maxParticleCount / 2; i++) {

                this.updatePosition(i, multiplier);
             }
     
             this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }
       
    }

    updatePosition = function(i, multiplier, ignoreSpeed) {
        let data = this.particleData[i];

        if (data === undefined) {
            return; // no data set, so particle is "despawned"
        }

        let speed = ignoreSpeed ? 1 * this.baseSpeed : data.getSpeed() * this.baseSpeed;
        const adjustedSpeed = Math.max(speed * multiplier * this.baseSpeed, this.particleMinSpeed);

        let ampMult = (this.particlePhaseAmplitudeMultMax - this.particlePhaseAmplitudeMultMin) * multiplier
                + this.particlePhaseAmplitudeMultMin;
        let phaseX = Math.sin(Math.PI * 2 * data.getPhase().x) * data.getPhaseAmplitude().x * ampMult;
        let phaseY = Math.sin(Math.PI * 2 * data.getPhase().y) * data.getPhaseAmplitude().y * ampMult;

        let baseIndex = this.VERTEX_SIZE * i;
        let x = this.particlesGeom.attributes.position.array[baseIndex + 0]
                + data.getTrajectory().x * adjustedSpeed
                + phaseX;
        let y = this.particlesGeom.attributes.position.array[baseIndex + 1]
                + data.getTrajectory().y * adjustedSpeed
                + phaseY;
        let z = this.particlesGeom.attributes.position.array[baseIndex + 2] + adjustedSpeed;

        if (z + this.particleDespawnBuffer > this.cameraZPlane) {
            this.despawnParticle(i);
        } else {
            this.applyPosition(i, x, y, z);
        }

        let speedMult = (this.particlePhaseSpeedMultMax - this.particlePhaseSpeedMultMin) * multiplier
                + this.particlePhaseSpeedMultMin;
        data.augmentPhase(
            data.getPhaseSpeed().x * speedMult,
            data.getPhaseSpeed().y * speedMult
        );
    }

    random = (min, max) => {
        return Math.random() * (max - min) + min;
    }

    initializeParticles = ()  => {
        this.particleData = [];
        this.baseSizes = [];
        this.baseSizes = [];

        this.maxParticleCount = Math.floor(this.maxParticleCount) + Math.floor(this.maxParticleCount) % 2;

        this.particleSystem = new THREE.Points(this.particlesGeom, this.pMaterial);
        this.particleSystem.sortParticles = true;
        this.particleSystem.geometry.dynamic = true;


        let posArr = new Float32Array(this.maxParticleCount * this.VERTEX_SIZE);
        let sizeArr = new Float32Array(this.maxParticleCount);
        let alphaArr = new Float32Array(this.maxParticleCount);

        this.particleSystem.geometry.addAttribute("position", new THREE.BufferAttribute(posArr, 3));
        this.particleSystem.geometry.addAttribute("size", new THREE.BufferAttribute(sizeArr, 1));

        for (let i = 0; i < this.maxParticleCount / 2; i++) {
            this.applyPosition(i, 0, 0, 0);
            this.baseSizes[i] = this.random(this.particleSizeMin, this.particleSizeMax);
            this.applyMirroredValue(alphaArr, i, Math.random(this.particleOpacityMin, this.particleOpacityMax));

            this.resetVelocity(i);
        }

        this.updateSizes();

        this.particleSystem.geometry.addAttribute("alpha", new THREE.BufferAttribute(alphaArr, 1));

        for (let i = 0; i < this.maxParticleCount / 2; i++) {
            this.updatePosition(i, Math.random() * this.cameraZPlane, true);
        }
    }

    spawnParticle = (i) => {
        this.resetVelocity(i); // attach a new speed to the particle, effectively "spawning" it
    }

    despawnParticle = (i) => {
        // we can't technically despawn a discrete particle since it's part of a
        // particle system, so we just reset the position and pretend
        this.resetPosition(i);
        this.particleData[i] = undefined; // clear the data so other functions know this particle is "despawned"
        this.resetVelocity(i);
    }

    resetPosition = (i) => {
        this.applyPosition(i, 0, 0, 0);
    }

    resetVelocity = (i) => {
        let r = this.random(this.particleRadiusMin, this.particleRadiusMax);
        let theta = Math.PI * Math.random() - Math.PI / 2;
        let trajectory = new THREE.Vector2(
            r * Math.cos(theta) / this.cameraZPlane,
            r * Math.sin(theta) / this.cameraZPlane
        );
        
        let speed = this.random(this.particleSpeedMultMin, this.particleSpeedMultMax);

        let phaseAmp = new THREE.Vector2(
            this.random(this.particlePhaseAmplitudeMin, this.particlePhaseAmplitudeMax),
            this.random(this.particlePhaseAmplitudeMin, this.particlePhaseAmplitudeMax)
        );

        let phaseSpeed = new THREE.Vector2(
            this.random(this.particlePhaseSpeedMin, this.particlePhaseSpeedMax),
            this.random(this.particlePhaseSpeedMin, this.particlePhaseSpeedMax)
        );

        this.particleData[i] = new ParticleData(trajectory, speed, phaseAmp, phaseSpeed);
    }

    updateSizes = () => {
        for (let i = 0; i < this.maxParticleCount / 2; i++) {
            this.applyMirroredValue(this.particlesGeom.attributes.size.array, i, this.baseSizes[i] * this.sizeMult);
        }
        this.particlesGeom.attributes.size.needsUpdate = true;
    }

     applyPosition = (i, x, y, z) => {
        let baseIndex = this.VERTEX_SIZE * i;
        this.applyMirroredValue(this.particlesGeom.attributes.position.array, baseIndex + 0, x, this.VERTEX_SIZE);
        this.applyMirroredValue(this.particlesGeom.attributes.position.array, baseIndex + 1, y, this.VERTEX_SIZE);
        this.applyMirroredValue(this.particlesGeom.attributes.position.array, baseIndex + 2, z, this.VERTEX_SIZE);
        this.particlesGeom.attributes.position.array[baseIndex + this.maxParticleCount * (3 / 2)] *= -1;
    }

    applyMirroredValue = (array, i, value, step = 1) => {
        array[i] = value;
        array[i + step * this.maxParticleCount / 2] = value;
    }

}

