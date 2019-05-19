



import BaseItem from '../BaseItem';

import LineGenerator from './LineGenerator'

//https://tympanus.net/codrops/2019/01/08/animated-mesh-lines/
export default class ParticleLines extends BaseItem {

    constructor(info) {
        super(info);
        this.name = "Particle Lines";
        this.gui = info.gui;
        this.scene = info.scene;
       // Build an array of points
        this.mesh =   new LineGenerator();
        this.mesh.start();
        info.scene.add(this.mesh);


        this.updateSpeedAmplitude = 0.73;
        this.updateOpacity = 0.3;
        this.__attribution = {
            showAttribution: true,
            name:"Animated Mesh Lines",
            authors: [
                {
                    name: "Jeremboo", 
                    social1: {type: "github", url: "https://github.com/Jeremboo"},
                },
          
            ],
            projectUrl: "https://github.com/Jeremboo/animated-mesh-lines",
            description: "",
            license: this.LICENSE.REQUIRE_ATTRIBUTION,
            changeDisclaimer: true,
            imageUrl: ""
        }

        this.setUpFolder();
    }

    dispose = () => {
        this.mesh.dispose();
    }

    stop = () => {
        this.mesh.stop();
    }

    play = () => {
        this.mesh.start();
    }

    __setUpGUI = (folder) => {

        const spawn = folder.addFolder("Spawn Settings")
        this.addController(spawn, this.mesh, "frequency",  {min: 0, max: 1})
        this.addController(spawn, this.mesh, "taper",  {values: ["linear", "none", "wavy"]})
        this.addController(spawn, this.mesh, "turbulenceAmt");
        this.addController(spawn, this.mesh, "nbrOfPoints", {step: 1, min: 0});
        this.addController(spawn, this.mesh, "width", {min: 0, max: 20});
        this.addController(spawn, this.mesh, "getRandomColor", {min: 0});
        this.addController(spawn, this.mesh, "color", {color: true});
        this.addController(spawn, this.mesh, "_scale", {min: 1, max: 100}).name("Scale");
        this.addController(spawn, this.mesh, "nrPrecisionPoints", {min: 1, max: 1000, step: 1}).name("Sample rate");


        const direction = spawn.addFolder("Direction");
        this.addController(direction, this.mesh, "directionXLower");
        this.addController(direction, this.mesh, "directionXUpper");
        this.addController(direction, this.mesh, "directionYLower");
        this.addController(direction, this.mesh, "directionYUpper");
        this.addController(direction, this.mesh, "directionZLower");
        this.addController(direction, this.mesh, "directionZUpper");

        const origin = spawn.addFolder("Origin position")
        this.addController(origin, this.mesh, "originX");
        this.addController(origin, this.mesh, "originY");
        this.addController(origin, this.mesh, "originZ");

        const length = spawn.addFolder("Length");
        this.addController(length, this.mesh, "lengthLower", {min: 0});
        this.addController(length, this.mesh, "lengthUpper", {min: 0});
        this.addController(length, this.mesh, "lengthMult", {min: 0});
        this.addController(length, this.mesh, "visibleLengthLower", {min: 0});
        this.addController(length, this.mesh, "visibleLengthUpper", {min: 0});
        this.addController(length, this.mesh, "visibleLengthMult", {min: 0});

        const speed = spawn.addFolder("Speed");
        this.addController(speed, this.mesh, "speedLower", {min: 0});
        this.addController(speed, this.mesh, "speedUpper", {min: 0});
        this.addController(speed, this.mesh, "speedMult", {min: 0});
        this.addController(folder, this, "updateSpeedAmplitude", {min: 0});
        this.addController(folder, this, "updateOpacity", {min: 0, max: 1.0});
    }

    update = (time, audioData) => {
        this.mesh.update(this.updateSpeedAmplitude, this.updateOpacity);
    }
}

 