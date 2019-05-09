import ShaderToyMaterial from "../../util/ShaderToyMaterial";
import { Vector2 } from "three";
import ImpactAnalyser from "editor/audio/ImpactAnalyser";
import fragShader from "../shaders/licensed/UniverseWithin";

export default class UniverseWithinMaterial extends ShaderToyMaterial {
    constructor(item) {
        super(fragShader, {
            uniforms: {
                iResolution: { value: new Vector2(item.width, item.height) },
                iTime: { value: 0.0 },
                mult: { value: 4.0 },
                fft: { value: 0.01 },
                NUM_LAYERS: { value: 4 }
            }
        });

        this.time = 0;
        this.lastTime = 0;
        this.amplitude = 0.1;
        this.baseSpeed = 0.8;
        this.frequency = 0.02;
        this.moveToAudioImpact = true;
        this.numLayers = 4;
        this.movementExaggeration = 5.0;

       
        item.__attribution = {
            showAttribution: true,
            name: "The Universe Within",
            authors: [
                {
                    name: "BigWIngs",
                    social1: {
                        type: "twitter",
                        url: "https://twitter.com/The_ArtOfCode"
                    },
                    social2: {
                        type: "youtube",
                        url:
                            "https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg"
                    }
                }
            ],
            projectUrl: "https://www.shadertoy.com/view/lscczl",
            description: "",
            license: item.LICENSE.REQUIRE_ATTRIBUTION,
            changeDisclaimer: true,
            imageUrl: "img/templates/UniverseWithin.png"
        };

        this.path = "material";
        this.__item = item;
    }

    updateMaterial = (time, audioData, shouldIncrement) => {
        const idx = Math.floor(
            this.frequency * (audioData.frequencyData.length / 2)
        );

        this.uniforms.iTime.value = time;
        if (this.moveToAudioImpact && this.impactAnalyser) {
            const impact = this.impactAnalyser.analyse(audioData.frequencyData);

            this.time +=this.baseSpeed * 0.01 + (time - this.lastTime) * impact  * this.movementExaggeration;
            this.uniforms.iTime.value = this.time;
        }

        this.uniforms.fft.value =
            0.01 + audioData.frequencyData[idx] * this.amplitude * 0.02;
        this.lastTime = time;
    };

    stop = () => {
        this.time = 0;
        this.lastTime = 0;
    };

    __setUpGUI = folder => {
        const i = this.__item;
        i.addController(folder, this, "numLayers", {values: [1, 2, 4, 8], min: 0, path: this.path}).onChange(
            () => (this.uniforms.NUM_LAYERS.value = this.numLayers)
        );

        i.addController(folder, this, "amplitude", 0, 1, 0.001);
        i.addController(folder, this, "frequency", 0, 1, 0.01);
        i.addController(folder, this, "moveToAudioImpact");
        i.addController(folder, this, "baseSpeed",  -50, 50, 0.1);
        i.addController(folder, this, "movementExaggeration", -10, 10, 0.1);
        i.addController(folder, this, "amplitude", 0, 1, 0.001);

        this.impactAnalyser = new ImpactAnalyser(folder, i);
        this.impactAnalyser.endBin = 60;
        this.impactAnalyser.deltaDecay = 20;
        return folder;
    };
}
