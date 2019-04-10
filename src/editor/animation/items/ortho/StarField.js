import * as THREE from 'three'
import ShaderToyMaterial from 'editor/util/ShaderToyMaterial'
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'
import BaseItem from '../BaseItem'



const fragmentShader = [
    "// Star Nest by Pablo Roman Andrioli",
    "// This content is under the MIT License.",
    "uniform float spe;",
    "uniform int iterations;",
    "uniform float formuparam;",
    "uniform int volsteps;",
    "uniform float stepsize;",
    "uniform float zoom;",
    "uniform float tile;",
    "uniform float speed;",
    "uniform float brightness;",
    "uniform float darkmatter;",
    "uniform float distfading;",
    "uniform float saturation;",
    "void mainImage( out vec4 fragColor, in vec2 fragCoord )",
    "{",
    "	//get coords and direction",
    "	vec2 uv=fragCoord.xy/iResolution.xy-.5;",
    "	uv.y*=iResolution.y/iResolution.x;",
    "	vec3 dir=vec3(uv*zoom,1.);",
    "	float time=iTime*speed+.25;",
    "	//mouse rotation",
    "	float a1=.5+iMouse.x/iResolution.x*2.;",
    "	float a2=.8+iMouse.y/iResolution.y*2.;",
    "	mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));",
    "	mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));",
    "	dir.xz*=rot1;",
    "	dir.xy*=rot2;",
    "	vec3 from=vec3(1.,.5,0.5);",
    "	from+=vec3(time*2.,time,-2.);",
    "	from.xz*=rot1;",
    "	from.xy*=rot2;",
    "	//volumetric rendering",
    "	float s=0.1,fade=1.;",
    "	vec3 v=vec3(0.);",
    "	for (int r=0; r<100; r++) {",
            "if(r > volsteps)break;",
    "		vec3 p=from+s*dir*.5;",
    "		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold",
    "		float pa,a=pa=0.;",
    "		for (int i=0; i< 100; i++) {",
                "if(i >= iterations)break;",
    "			p=abs(p)/dot(p,p)-formuparam; // the magic formula",
    "			a+=abs(length(p)-pa); // absolute sum of average change",
    "			pa=length(p);",
    "		}",
    "		float dm=max(0.,darkmatter-a*a*.001); //dark matter",
    "		a*=a*a; // add contrast",
    "		if (r>6) fade*=1.-dm; // dark matter, don't render near",
    "		//v+=vec3(dm,dm*.5,0.);",
    "		v+=fade;",
    "		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade*spe; // coloring based on distance",
    "		fade*=distfading; // distance fading",
    "		s+=stepsize;",
    "	}",
    "	v=mix(vec3(length(v)),v,saturation); //color adjust",
    "	fragColor = vec4(v*.01,1.);",
    "}",
    
].join("\n");



export default class StarField extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Star Nest";
        
        this.geo = new THREE.PlaneGeometry(2,2);
        this.mat = new ShaderToyMaterial(fragmentShader, 
            {
                uniforms: { 
                    spe: {value: 1.8},
                    iterations: {value: 17},
                    formuparam: {value: 0.53},
                    volsteps: {value: 20},
                    stepsize: {value: 0.1},
                    zoom: {value: 0.800},
                    tile: {value: 0.850},
                    speed: {value: 0.010},
                    brightness: {value: 0.0015},
                    darkmatter: {value: 0.300},
                    distfading: {value: 0.730},
                    saturation: {value: 0.850}
                }
            }
        );
        
        this.mesh = new THREE.Mesh(this.geo, this.mat);
        info.scene.add(this.mesh);


        //GUi
        this.brightenToAudio = true;
        this.brightenMultipler = 1;
        this.brightness = 1.0;
        this.__setUpFolder();
        this.impactAnalyser = new ImpactAnalyser(this.folder);
        this.impactAnalyser.endBin = 60;
        this.impactAnalyser.deltaDecay = 20;
        this.folder.updateDisplay();

        this.__attribution = {
            showAttribution: true,
            name:"Star Nest",
            authors: [
                {
                    name: "Kali", 
                    social1: {type: "website", url: "https://www.shadertoy.com/user/Kali"},
                },
            ],
            projectUrl: "https://www.shadertoy.com/view/XlfGRj",
            description: "3D kaliset fractal - volumetric rendering and some tricks.",
            license: this.LICENSE.MIT,
            changeDisclaimer: true,
            //TODO change image
            imageUrl: "img/templates/StarField.png"
        }
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "brightenToAudio");
        folder.add(this, "brightness");
        folder.add(this, "brightenMultipler"); 

        folder.add(this.mat.uniforms.iterations, "value", 1, 50).name("Iterations");
        folder.add(this.mat.uniforms.formuparam, "value").name("formuparam");
        folder.add(this.mat.uniforms.volsteps, "value").name("volsteps");
        folder.add(this.mat.uniforms.stepsize, "value").name("stepsize");
        folder.add(this.mat.uniforms.zoom, "value").name("zoom");
        folder.add(this.mat.uniforms.tile, "value").name("tile");
        folder.add(this.mat.uniforms.speed, "value").name("speed");
        folder.add(this.mat.uniforms.brightness, "value").name("brightness");
        folder.add(this.mat.uniforms.darkmatter, "value").name("darkmatter");
        folder.add(this.mat.uniforms.distfading, "value").name("distfading");
        folder.add(this.mat.uniforms.saturation, "value").name("saturation");

        return this.__addFolder(folder);
    }

    update = (time, audioData, shouldIncrement) => {
        this.mat.uniforms.iTime.value = time;
        if(this.brightenToAudio && this.impactAnalyser) {
            const impact = this.impactAnalyser.analyse(audioData.frequencyData) ;
            this.mat.uniforms.spe.value = this.brightness + impact * this.brightenMultipler * -0.0005;
        }
    }
    
}