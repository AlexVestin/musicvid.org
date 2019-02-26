//https://www.shadertoy.com/view/MslGWN
import * as THREE from "three";
import ShaderToyMaterial from "../../../util/ShaderToyMaterial";
import ImpactAnalyser from "../../../audio/ImpactAnalyser";
import SpectrumAnalyser from "../../../audio/SpectrumAnalyser";

const fragmentShader = [
    "//CBS",
    "//Parallax scrolling fractal galaxy.",
    "//Inspired by JoshP's Simplicity shader: https://www.shadertoy.com/view/lslGWr",
    "// http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/",
    "uniform vec4 freqs;",
    "float field(in vec3 p,float s) {",
    "	float strength = 7. + .03 * log(1.e-6 + fract(sin(iTime) * 4373.11));",
    "	float accum = s/4.;",
    "	float prev = 0.;",
    "	float tw = 0.;",
    "	for (int i = 0; i < 26; ++i) {",
    "		float mag = dot(p, p);",
    "		p = abs(p) / mag + vec3(-.5, -.4, -1.5);",
    "		float w = exp(-float(i) / 7.);",
    "		accum += w * exp(-strength * pow(abs(mag - prev), 2.2));",
    "		tw += w;",
    "		prev = mag;",
    "	}",
    "	return max(0., 5. * accum / tw - .7);",
    "}",
    "// Less iterations for second layer",
    "float field2(in vec3 p, float s) {",
    "	float strength = 7. + .03 * log(1.e-6 + fract(sin(iTime) * 4373.11));",
    "	float accum = s/4.;",
    "	float prev = 0.;",
    "	float tw = 0.;",
    "	for (int i = 0; i < 18; ++i) {",
    "		float mag = dot(p, p);",
    "		p = abs(p) / mag + vec3(-.5, -.4, -1.5);",
    "		float w = exp(-float(i) / 7.);",
    "		accum += w * exp(-strength * pow(abs(mag - prev), 2.2));",
    "		tw += w;",
    "		prev = mag;",
    "	}",
    "	return max(0., 5. * accum / tw - .7);",
    "}",
    "vec3 nrand3( vec2 co )",
    "{",
    "	vec3 a = fract( cos( co.x*8.3e-3 + co.y )*vec3(1.3e5, 4.7e5, 2.9e5) );",
    "	vec3 b = fract( sin( co.x*0.3e-3 + co.y )*vec3(8.1e5, 1.0e5, 0.1e5) );",
    "	vec3 c = mix(a, b, 0.5);",
    "	return c;",
    "}",
    "void mainImage( out vec4 fragColor, in vec2 fragCoord ) {",
    "    vec2 uv = 2. * fragCoord.xy / iResolution.xy - 1.;",
    "	vec2 uvs = uv * iResolution.xy / max(iResolution.x, iResolution.y);",
    "	vec3 p = vec3(uvs / 4., 0) + vec3(1., -1.3, 0.);",
    "	p += .2 * vec3(sin(iTime / 16.), sin(iTime / 12.),  sin(iTime / 128.));",
    "	//Sound",

    "	float t = field(p,freqs.b);",
    "	float v = (1. - exp((abs(uv.x) - 1.) * 6.)) * (1. - exp((abs(uv.y) - 1.) * 6.));",
    "    //Second Layer",
    "	vec3 p2 = vec3(uvs / (4.+sin(iTime*0.11)*0.2+0.2+sin(iTime*0.15)*0.3+0.4), 1.5) + vec3(2., -1.3, -1.);",
    "	p2 += 0.25 * vec3(sin(iTime / 16.), sin(iTime / 12.),  sin(iTime / 128.));",
    "	float t2 = field2(p2, freqs.a);",
    "	vec4 c2 = mix(.4, 1., v) * vec4(1.3 * t2 * t2 * t2 ,1.8  * t2 * t2 , t2* freqs.r, t2);",
    "	//Let's add some stars",
    "	//Thanks to http://glsl.heroku.com/e#6904.0",
    "	vec2 seed = p.xy * 2.0;",
    "	seed = floor(seed * iResolution.x);",
    "	vec3 rnd = nrand3( seed );",
    "	vec4 starcolor = vec4(pow(rnd.y,40.0));",
    "	//Second Layer",
    "	vec2 seed2 = p2.xy * 2.0;",
    "	seed2 = floor(seed2 * iResolution.x);",
    "	vec3 rnd2 = nrand3( seed2 );",
    "	starcolor += vec4(pow(rnd2.y,40.0));",
    "	fragColor = mix(freqs.a-.3, 1., v) * vec4(1.5*freqs.b * t * t* t , 1.2*freqs.g * t * t, freqs.z*t, 1.0)+c2+starcolor;",
    "}"
].join("\n");

export default class Aurora {
    constructor(info) {
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

        this.folder = this.setUpGUI(info.gui, "Aurora");
        this.impactAnalyser = new ImpactAnalyser(this.folder);
        this.spectrumAnalyser = new SpectrumAnalyser(this.folder);
        this.spectrumAnalyser.minDecibel = -100;
        this.spectrumAnalyser.maxDecibel = -33;        
        this.spectrumAnalyser.smoothingTimeConstant = 0.2;

        this.impactAnalyser.endBin = 60;
        this.impactAnalyser.deltaDecay = 20;

        this.folder.updateDisplay();
    }

    stop = () => {};

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "brightenToAudio");
        folder.add(this, "brightness");
        folder.add(this, "brightenMultipler");
        folder.add(this, "limit");
        folder.add(this, "mult");
        return folder;
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
