import ShaderToyMaterial from "../../util/ShaderToyMaterial";
import fragShader from "../shaders/StarNest";
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'

export default class StarNestMaterial extends ShaderToyMaterial {
    constructor(item) {
        super(fragShader, {
            uniforms: {
                spe: { value: 1.8 },
                iterations: { value: 17 },
                formuparam: { value: 0.53 },
                volsteps: { value: 20 },
                stepsize: { value: 0.1 },
                zoom: { value: 0.8 },
                tile: { value: 0.85 },
                speed: { value: 0.01 },
                brightness: { value: 0.0015 },
                darkmatter: { value: 0.3 },
                distfading: { value: 0.73 },
                saturation: { value: 0.85 }
            }
        });

        this.brightenToAudio = true;
        this.brightenMultipler = 1;
        this.brightness = 1.0;

        item.__attribution = {
            showAttribution: true,
            name: "Star Nest",
            authors: [
                {
                    name: "Kali",
                    social1: {
                        type: "website",
                        url: "https://www.shadertoy.com/user/Kali"
                    }
                }
            ],
            projectUrl: "https://www.shadertoy.com/view/XlfGRj",
            description:
                "3D kaliset fractal - volumetric rendering and some tricks.",
            license: item.LICENSE.MIT,
            changeDisclaimer: true,
            //TODO change image
            imageUrl: "img/templates/StarField.png"
        };
    }

    __setUpGUI = folder => {
        folder.add(this, "brightenToAudio");
        folder.add(this, "brightness");
        folder.add(this, "brightenMultipler");
        
        folder.add(this.uniforms.iterations, "value", 1, 50)
            .name("Iterations");
        folder.add(this.uniforms.formuparam, "value").name("formuparam");
        folder.add(this.uniforms.volsteps, "value").name("volsteps");
        folder.add(this.uniforms.stepsize, "value").name("stepsize");
        folder.add(this.uniforms.zoom, "value").name("zoom");
        folder.add(this.uniforms.tile, "value").name("tile");
        folder.add(this.uniforms.speed, "value").name("speed");
        folder.add(this.uniforms.brightness, "value").name("brightness");
        folder.add(this.uniforms.darkmatter, "value").name("darkmatter");
        folder.add(this.uniforms.distfading, "value").name("distfading");
        folder.add(this.uniforms.saturation, "value").name("saturation");
        this.impactAnalyser = new ImpactAnalyser(folder);
        this.impactAnalyser.endBin = 60;
        this.impactAnalyser.deltaDecay = 20;
        this.folder = folder;
        return folder;
    };

    updateMaterial = (time, audioData, shouldIncrement) => {
        this.uniforms.iTime.value = time;
        console.log(time);
        if (this.brightenToAudio && this.impactAnalyser) {
            const impact = this.impactAnalyser.analyse(audioData.frequencyData);
            this.uniforms.spe.value =
                this.brightness + impact * this.brightenMultipler * -0.0005;
        }
    };
}
