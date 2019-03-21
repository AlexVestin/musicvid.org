//FROM https://github.com/caseif/vis.js

/**
 * My Extension of vis.js
 *
 *  Copyright @caseif https://github.com/caseif/vis.js
 *  @license BSD-new (New BSD License) 
 */

import * as THREE from "three";
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'
import BaseItem from "../BaseItem";
/* *************************** */
/* * Basic particle settings * */
/* *************************** */
// COUNT
var baseParticleCount = 1000; // the number of particles at 1080p
var fleckCount = 50; // total fleck count
var bokehCount = 250; // total bokeh count
// OPACITY
var particleOpacity = 0.7; // opacity of primary particles
var bokehOpacity = 0.5; // opacity of bokeh (raising this above 0.5 results in weird behavior)
// SIZE
var minParticleSize = 4; // the minimum size scalar for particle systems
var maxParticleSize = 7; // the maximum size scalar for particle systems
var particleSizeExponent = 2; // the exponent to apply during dynamic particle scaling (similar to spectrum exponents)
// POSITIONING
var yVelRange = 3; // the range for particle y-velocities
var xPosBias = 4.5; // bias for particle x-positions (higher values = more center-biased)
var zPosRange = 450; // the range of z-particles
var zModifier = -250; // the amount to add to z-positions
var zPosBias = 2.3; // bias for particle z-positions (higher values = more far-biased)
var leftChance = 0.88; // the chance for a particle to spawn along the left edge of the screen
var rightChance = 0.03; // the chance for a particle to spawn along the right edge of the screen
var topBottomChance = 0.09; // the chance for a particle to spawn along the top/bottom edges of the screen
// VELOCITY
var velBias = 1.8; // bias for particle velocities (higher values = more center-biased)
var minParticleVelocity = 2; // the minimum scalar for particle velocity
var maxParticleVelocity = 5; // the maximum scalar for particle velocity
var fleckVelocityScalar = 1.75; // velocity of flecks relative to normal particles
var fleckYVelScalar = 0.75; // y-velocity range of flecks relative to x-velocity
var bokehMinVelocity = maxParticleVelocity * 0.15; // the minimum velocity of bokeh
var bokehMaxVelocity = maxParticleVelocity * 0.3; // the maximum velocity of bokeh

var particleSize = minParticleSize;
var particleExponent = 4.5; // the power to raise velMult to after initial computation

var fleckZ = 150;
var bokehYVelRange = (bokehMinVelocity + bokehMaxVelocity) * 0.5 * 2;
var bokehZ = 200;
var color = "#FFFFFF";

var VIEW_ANGLE = 45;

var fleckVelocity = maxParticleVelocity * fleckVelocityScalar;

export default class Particles extends BaseItem {
    constructor(info) {
        super(info);

        this.name = "Star Particles";

        this.amplitude = 9.5;
        this.baseSpeed = 18.0;
        this.camera = info.camera;
        var particleCount = baseParticleCount;
        this.resRatio = info.width / 1920;

        this.aspect = info.width / info.height;

        //TODO: split main system into foreground and background particles
        this.particles = new THREE.Geometry();
        this.flecks = new THREE.Geometry();
        this.bokeh = new THREE.Geometry();

        const textureLoader = new THREE.TextureLoader();

        var stdTexure = textureLoader.load("./img/particle3.png");
        stdTexure.minFilter = THREE.LinearFilter;

        var fleckTexture = textureLoader.load("./img/fleck.png");
        fleckTexture.minFilter = THREE.LinearFilter;

        var bokehTexture = textureLoader.load("./img/bokeh.png");
        bokehTexture.minFilter = THREE.LinearFilter;


        const alphaTest = 0.0000001;
        this.pMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            opacity: particleOpacity,
            size: 5,
            map: stdTexure,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        this.pMaterial.alphaTest = alphaTest;
        this.particleColor = "#ffffff";

        this.fleckMaterial = new THREE.PointsMaterial({
            color: color,
            opacity: particleOpacity,
            size: 4,
            map: fleckTexture,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        this.fleckColor = "#ffffff";

        this.fleckMaterial.alphaTest = alphaTest;

        this.bokehMaterial = new THREE.PointsMaterial({
            color: brighten(color, 2.1),
            opacity: bokehOpacity,
            size: 100,
            map: bokehTexture,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        this.bokehColor = "#ffffff";

        this.bokehMaterial.alphaTest = alphaTest;

        this.velocityResScale = Math.pow(this.resRatio, 5);
        var fleckVelocity = maxParticleVelocity * fleckVelocityScalar;


        let xRange, yRange, pX, pY, pZ, p;
        let particle;
        for (p = 0; p < particleCount; p++) {
            var z = biasedRandom(zPosRange, zPosBias) + zModifier;
            xRange =
                Math.abs(this.camera.position.z - z) *
                Math.tan(toRads(VIEW_ANGLE)) *
                2; // maximum range on the x-axis at this z-value
            yRange =
                Math.abs(this.camera.position.z - z) *
                Math.tan(toRads(VIEW_ANGLE / this.aspect)) *
                2; // maximum range on the y-axis at this z-value
            pX = Math.random() * xRange - xRange / 2
            pY = centerBiasedRandom(yRange, xPosBias)
            pZ = z
            particle = new THREE.Vector3(pX, pY, pZ);

            // create a velocity vector
            particle.velocity = new THREE.Vector3(
                this.velocityResScale *
                    (Math.random() *
                        (maxParticleVelocity - minParticleVelocity) +
                        minParticleVelocity),
                        this.velocityResScale * centerBiasedRandom(yVelRange, velBias),
                0
            );

            // add it to the geometry
            this.particles.vertices.push(particle);
            
        }

        fleckYVelScalar *= fleckVelocity;

        var fleckZ = 150;
        let fleck;
        for (p = 0; p < fleckCount; p++) {
            z = fleckZ;
            xRange =
                Math.abs(this.camera.position.z - z) *
                Math.tan(toRads(VIEW_ANGLE)) *
                2; // maximum range on the x-axis at this z-value
            yRange =
                Math.abs(this.camera.position.z - z) *
                Math.tan(toRads(VIEW_ANGLE / this.aspect)) *
                2; // maximum range on the y-axis at this z-value
            pX = Math.random() * xRange - xRange / 2
            pY = Math.floor(Math.random() * yRange) - yRange / 2
            pZ = z
            fleck = new THREE.Vector3(pX, pY, pZ);
            fleck.fleck = true;

            // create a velocity vector
            fleck.velocity = new THREE.Vector3(
                this.velocityResScale * fleckVelocity,
                this.velocityResScale * centerBiasedRandom(fleckYVelScalar, velBias),
                0
            );

            // add it to the geometry
            this.flecks.vertices.push(fleck);
        }

        var bokehYVelRange = (bokehMinVelocity + bokehMaxVelocity) * 0.5 * 2;

        var bokehZ = 200;
        let b;
        for (p = 0; p < bokehCount; p++) {
            z = bokehZ;
            //var z = Math.random() * zPosRange - (zPosRange / 2);
            xRange =
                Math.abs(this.camera.position.z - z) *
                Math.tan(toRads(VIEW_ANGLE)) *
                2; // maximum range on the x-axis at this z-value
            yRange =
                Math.abs(this.camera.position.z - z) *
                Math.tan(toRads(VIEW_ANGLE / this.aspect)) *
                2; // maximum range on the y-axis at this z-value
            pX = Math.random() * xRange - xRange / 2
            pY = Math.random() * yRange - yRange / 2
            pZ = z
            b = new THREE.Vector3(pX, pY, pZ);
            b.bokeh = true;

            // create a velocity vector
            b.velocity = new THREE.Vector3(
                this.velocityResScale *
                    (Math.random() * (bokehMaxVelocity - bokehMinVelocity) +
                        bokehMinVelocity),
                        this.velocityResScale *
                    (Math.random() * bokehYVelRange - bokehYVelRange / 2),
                0
            );

            // add it to the geometry
            this.bokeh.vertices.push(b);
        }

        // create the particle systems
        var particleSystem = new THREE.Points(this.particles, this.pMaterial);
        var fleckSystem = new THREE.Points(this.flecks, this.fleckMaterial);
        var bokehSystem = new THREE.Points(this.bokeh, this.bokehMaterial);

        particleSystem.sortParticles = true;
        particleSystem.geometry.dynamic = true;

        fleckSystem.sortParticles = true;
        fleckSystem.geometry.dynamic = true;

        bokehSystem.sortParticles = true;
        bokehSystem.geometry.dynamic = true;

        // add it to the scene

        var pointLight = new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;

        // add to the scene
       

        this.mesh = new THREE.Group();
        this.mesh.add(particleSystem);
        this.mesh.add(fleckSystem);
        this.mesh.add(bokehSystem);
        this.mesh.add(pointLight);

        this.frustum = new THREE.Frustum();
        this.camera.updateMatrixWorld();
        this.frustum.setFromMatrix(
            new THREE.Matrix4().multiplyMatrices(
                this.camera.projectionMatrix,
                this.camera.matrixWorldInverse
            )
        );
        this.particleSystem = particleSystem;
        this.fleckSystem = fleckSystem;
        this.bokehSystem = bokehSystem;

        info.scene.add(this.mesh);
        
        this.__setUpFolder();
        

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
            projectUrl: "https://github.com/caseif/vis.js",
            description: "",
            license: this.LICENSE.REQUIRE_ATTRIBUTION,
            changeDisclaimer: true,
            //TODO change image
            imageUrl: "img/templates/Monstercat.png"
        }
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "amplitude", 0, 200, 0.1);
        folder.add(this, "baseSpeed", 0, 500);

        folder.add(this.fleckSystem, "visible").name("Fleck system visible");
        folder.addColor(this, "fleckColor").onChange(() => { this.fleckMaterial.color = new THREE.Color(this.fleckColor); });
        folder.add(this.particleSystem, "visible").name("Particle system visible");
        folder.addColor(this, "particleColor").onChange(() => { this.pMaterial.color = new THREE.Color(this.particleColor); });
        folder.add(this.bokehSystem, "visible").name("Bokeh system visible");
        folder.addColor(this, "bokehColor").onChange(() => { this.bokehMaterial.color = new THREE.Color(this.bokehColor); });


        this.analyser = new ImpactAnalyser(folder);
        this.analyser.deltaDecay = 2; 
        return this.__addFolder(folder);
    }

    isInView(particle) {
        const {
            /*bokehMaterial,
            fleckMaterial,
            pMaterial,*/
            frustum,
        } = this;

        var translated = new THREE.Vector3();
        /*var size = particle.bokeh
            ? bokehMaterial.size
            : particle.fleck
            ? fleckMaterial.size
            : pMaterial.size;*/
        translated.x = particle.x;
        translated.y = particle.y;
        translated.z = particle.z - 20;
        if (translated.x < 0) {
            translated.x += frustumPadding;
        } else {
            translated.x -= frustumPadding;
        }
        if (translated.y < 0) {
            translated.y += frustumPadding;
        } else {
            translated.y -= frustumPadding;
        }
        return frustum.containsPoint(translated);
    }

    resetParticle(particle) {
        var rand = Math.random();
        var side;
        if (rand < leftChance) {
            side = 0;
        } else if (rand < leftChance + rightChance) {
            side = 2;
        } else if (rand < leftChance + rightChance + topBottomChance / 2) {
            side = 1;
        } else {
            side = 3;
        }

        var pos = this.getValidSpawnPosition(
            side,
            particle.bokeh,
            particle.fleck
        );
        particle.x = pos.x;
        particle.y = pos.y;
        particle.z = pos.z;

        var yRange = particle.bokeh
            ? bokehYVelRange
            : particle.fleck
            ? fleckYVelScalar
            : yVelRange;
        var velVector = new THREE.Vector3(
            (side !== 0 ? 0.5 : 1) * particle.bokeh
                ? Math.random() * (bokehMaxVelocity - bokehMinVelocity) +
                  bokehMinVelocity
                : particle.fleck
                ? fleckVelocity
                : Math.random() * (maxParticleVelocity - minParticleVelocity) +
                  minParticleVelocity,
            centerBiasedRandom(yRange, velBias),
            0
        );
        velVector = velVector.multiply(
            new THREE.Vector3(
                this.velocityResScale,
                this.velocityResScale,
                this.velocityResScale
            )
        );
        if (side === 0) {
            particle.velocity = velVector;
        } else if (side === 2) {
            particle.velocity = velVector.multiply(new THREE.Vector3(-1, 1, 1));
        } else if (side === 1) {
            particle.velocity = new THREE.Vector3(
                velVector.y,
                velVector.x,
                velVector.z
            );
        } else if (side === 3) {
            particle.velocity = new THREE.Vector3(
                velVector.y,
                -velVector.x,
                velVector.z
            );
        }
    }

    update = (time, audioData) => {
        const amp = this.analyser.analyse(audioData.frequencyData) * this.amplitude;     
        this.velMult = amp / 512;
        this.velMult = isNaN(this.velMult) ? 0 : this.velMult;
        particleSize = this.velMult;
        this.velMult = Math.pow(this.velMult, particleExponent) * (1 - this.baseSpeed / 1000) + (this.baseSpeed / 1000);

        particleSize = (maxParticleSize - minParticleSize) * Math.pow(particleSize, particleSizeExponent) + minParticleSize;
        this.updateParticles();
    };

    updateParticles() {
        const {
            particleSystem,
            particles,
            velMult,
            flecks,
            fleckSystem,
            bokeh,
            bokehSystem
        } = this;
        particleSystem.material.size = particleSize;

        let particle, i;
        for (i = 0; i < particles.vertices.length; i++) {
            particle = particles.vertices[i];
            particle.x += particle.velocity.x * velMult;
            particle.y += particle.velocity.y * velMult;
            particle.z += particle.velocity.z * velMult;
            if (particle.x > 0 && !this.isInView(particle)) {
                this.resetParticle(particle);
            }
        }
        particleSystem.geometry.__dirtyVertices = true;
        particleSystem.geometry.verticesNeedUpdate = true;

        for (i = 0; i < flecks.vertices.length; i++) {
            particle = flecks.vertices[i];
            particle.x += particle.velocity.x * velMult;
            particle.y += particle.velocity.y * velMult;
            particle.z += particle.velocity.z * velMult;
            if (particle.x > 0 && !this.isInView(particle)) {
                this.resetParticle(particle);
            }
        }
        fleckSystem.geometry.__dirtyVertices = true;
        fleckSystem.geometry.verticesNeedUpdate = true;

        for (i = 0; i < bokeh.vertices.length; i++) {
            particle = bokeh.vertices[i];
            particle.x += particle.velocity.x * velMult;
            particle.y += particle.velocity.y * velMult;
            //particle.z += particle.velocity.z * velMult;
            if (particle.x > 0 && !this.isInView(particle)) {
                this.resetParticle(particle);
            }
        }
        bokehSystem.geometry.__dirtyVertices = true;
        bokehSystem.geometry.verticesNeedUpdate = true;
    }


    getValidSpawnPosition(side, bokeh, fleck) {
        var z = bokeh
            ? bokehZ
            : fleck
            ? fleckZ
            : biasedRandom(zPosRange, zPosBias) + zModifier; // random z-value

        let x, yRange, y, xRange;
        if (side === 0 || fleck) {
            // left
            x = -this.getXRangeAtZ(z) / 2; // x-value intersecting the frustum at this z-value
            yRange = this.getYRangeAtZ(z); // maximum range on the y-axis at this z-value
            y = bokeh
                ? Math.random() * yRange - yRange / 2
                : centerBiasedRandom(yRange, xPosBias); // random y-value within calculated range
        } else if (side === 2) {
            // right
            x = this.getXRangeAtZ(z) / 2;
            yRange = this.getYRangeAtZ(z);
            y = bokeh
                ? Math.random() * yRange - yRange / 2
                : centerBiasedRandom(yRange, xPosBias); // random y-value within calculated range
        } else if (side === 1) {
            // top
            y = -this.getYRangeAtZ(z) / 2;
            xRange = this.getXRangeAtZ(z);
            x = Math.random() * xRange - xRange / 2;
        } else {
            // bottom
            y = this.getYRangeAtZ(z) / 2;
            xRange = this.getXRangeAtZ(z);
            x = Math.random() * xRange - xRange / 2;
        }
        return new THREE.Vector3(x, y, z);
    }

 

    getXRangeAtZ(z) {
        return (
            Math.abs(this.camera.position.z - z) *
            Math.tan(toRads(VIEW_ANGLE)) *
            2
        );
    }

    getYRangeAtZ(z) {
        return (
            Math.abs(this.camera.position.z - z) *
            Math.tan(toRads(VIEW_ANGLE / this.aspect)) *
            2
        );
    }
}

function brighten(hexString, factor) {
    hexString = hexString.replace("#", "");
    var redHex = hexString.substring(0, 2);
    var greenHex = hexString.substring(2, 4);
    var blueHex = hexString.substring(4, 6);
    var newRed = Math.floor(
        parseInt("0x" + redHex) * (1 / factor) + 255 * ((factor - 1) / factor)
    );
    var newGreen = Math.floor(
        parseInt("0x" + greenHex) * (1 / factor) + 255 * ((factor - 1) / factor)
    );
    var newBlue = Math.floor(
        parseInt("0x" + blueHex) * (1 / factor) + 255 * ((factor - 1) / factor)
    );
    var newColor =
        "#" +
        newRed.toString(16).toUpperCase() +
        newGreen.toString(16).toUpperCase() +
        newBlue.toString(16).toUpperCase();
    return newColor;
}

function biasedRandom(range, bias) {
    return range - Math.pow(Math.random() * Math.pow(range, bias), 1 / bias);
}

var frustumPadding = 50; // the units to pad the frustum by
function centerBiasedRandom(range, bias) {
    return biasedRandom(range / 2, bias) * (Math.random() >= 0.5 ? 1 : -1);
}

function toRads(degs) {
    return (degs * Math.PI) / 180;
}
