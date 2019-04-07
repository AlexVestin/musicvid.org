//https://www.shadertoy.com/view/MslGWN
import * as THREE from "three";
import ShaderToyMaterial from "editor/util/ShaderToyMaterial";
import ImpactAnalyser from "editor/audio/ImpactAnalyser";
import SpectrumAnalyser from "editor/audio/SpectrumAnalyser";
import BaseItem from "../BaseItem";
import fragmentShader from '../../shaders/licensed/SimplicityGalaxy'

export default class SimplicityGalaxy extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Simplicity Galaxy";
        this.geo = new THREE.PlaneGeometry(2, 2);
        this.mat = new ShaderToyMaterial(fragmentShader, {
            uniforms: {
                spe: { value: 1.8 },
                iResolution: {
                    value: new THREE.Vector2(info.width, info.height)
                },
                iTime: { value: 0 },
                freqs: { value: new THREE.Vector4(0, 0, 0, 0) }
            }
        });

        this.mesh = new THREE.Mesh(this.geo, this.mat);
        info.scene.add(this.mesh);

        this.mult = 1.0;
        this.limit = 0.64;
        //GUi
        this.brightenToAudio = true;
        this.brightenMultipler = 1;
        this.brightness = 1.0;

        this.__setUpFolder();
        this.impactAnalyser = new ImpactAnalyser(this.folder);
        this.spectrumAnalyser = new SpectrumAnalyser(this.folder);
        this.spectrumAnalyser.minDecibel = -100;
        this.spectrumAnalyser.maxDecibel = -33;        
        this.spectrumAnalyser.smoothingTimeConstant = 0.2;

        this.impactAnalyser.endBin = 60;
        this.impactAnalyser.deltaDecay = 20;

        this.folder.updateDisplay();

        this.__attribution = {
            showAttribution: true,
            name:"Simplicity Galaxy",
            authors: [
                {
                    name: "CBS", 
                    social1: {type: "website", url: "https://www.shadertoy.com/user/CBS"},
                },
            ],
            projectUrl: "https://www.shadertoy.com/view/MslGWN",
            description: "Parallax scrolling fractal galaxy.",
            license: this.LICENSE.MIT,
            changeDisclaimer: true,
            //TODO change image
            imageUrl: "img/templates/SimplicityGalaxy.png"
        }
    }

    stop = () => {};

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "brightenToAudio");
        folder.add(this, "brightness");
        folder.add(this, "brightenMultipler");
        folder.add(this, "limit");
        folder.add(this, "mult");
        return this.__addFolder(folder);
    };

    update = (time, audioData) => {
        this.mat.uniforms.iTime.value = time;
        const freqs = this.spectrumAnalyser.analyse(audioData.frequencyData);
        if (this.brightenToAudio && this.impactAnalyser) {
            this.mat.uniforms.freqs.value = new THREE.Vector4(
                Math.max(freqs[3] * this.mult / 120, this.limit),
                Math.max(freqs[8] * this.mult / 320, this.limit),
                Math.max(freqs[15] * this.mult / 220, this.limit),
                Math.max(freqs[27] * this.mult / 128, this.limit)
            );
            //this.mat.uniforms.spe.value = this.brightness + impact * this.brightenMultipler * -0.0005;
        }
    };
}
