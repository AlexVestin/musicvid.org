import ShaderToyMaterial from 'editor/animation/util/ShaderToyMaterial'
import { Vector2 } from "three";
import ImpactAnalyser from "../audio/ImpactAnalyser";
import fragShader from "../shaders/OctaveMeatballs";

export default class OctaveMeatballs extends ShaderToyMaterial {
    constructor(item) {
        super(fragShader, {
            uniforms: {
                iResolution: { value: new Vector2(item.width, item.height) },
                iTime: { value: 0.0 },
            }
        });

        this.time = 0;
        this.lastTime = 0;
        this.baseSpeed = 0.8;
        this.frequency = 0.02;
        this.moveToAudioImpact = true;
        this.movementExaggeration = 5.0;

       
        item.__attribution = {
            showAttribution: true,
            name: "Octave Meatballs",
            authors: [
                {
                    name: "stormy",
                    social1: {
                        type: "shadertoy",
                        url: "https://www.shadertoy.com/view/WlXSzn"
                    },
     
                }
            ],
            projectUrl: "https://www.shadertoy.com/view/WlXSzn",
            description: "",
            license: item.LICENSE.REQUIRE_ATTRIBUTION,
            changeDisclaimer: true,
            imageUrl: "img/templates/UniverseWithin.png"
        };

        this.path = "material";
        this.__item = item;
    }

    updateMaterial = (time, dt, audioData, shouldIncrement) => {
        this.uniforms.iTime.value = time;
        if (this.moveToAudioImpact && this.impactAnalyser) {
            const impact = this.impactAnalyser.analyse(audioData.frequencyData);

            this.time += this.baseSpeed * 0.01 + dt * impact  * this.movementExaggeration / 10;
            this.uniforms.iTime.value = this.time;
        }

        this.lastTime = time;
    };

    stop = () => {
        this.time = 0;
        this.lastTime = 0;
    };

    __setUpGUI = folder => {
        const i = this.__item;
        i.addController(folder, this, "moveToAudioImpact");
        i.addController(folder, this, "baseSpeed",  -50, 50, 0.1);
        i.addController(folder, this, "movementExaggeration", -10, 10, 0.1);
        this.impactAnalyser = new ImpactAnalyser(folder, i);
        this.impactAnalyser.endBin = 60;
        this.impactAnalyser.deltaDecay = 20;
        return folder;
    };
}
