import * as THREE from 'three'
import ShaderToyMaterial from '../../../util/ShaderToyMaterial'
import ImpactAnalyser from '../../../audio/ImpactAnalyser'
import BaseItem from './BaseItem'



const fragmentShader = [
    "// Star Nest by Pablo Roman Andrioli",
    "// This content is under the MIT License.",
    "uniform float spe;",
    "#define iterations 17",
    "#define formuparam 0.53",
    "#define volsteps 20",
    "#define stepsize 0.1",
    "#define zoom   0.800",
    "#define tile   0.850",
    "#define speed  0.010",
    "#define brightness 0.0015",
    "#define darkmatter 0.300",
    "#define distfading 0.730",
    "#define saturation 0.850",
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
    "	for (int r=0; r<volsteps; r++) {",
    "		vec3 p=from+s*dir*.5;",
    "		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold",
    "		float pa,a=pa=0.;",
    "		for (int i=0; i<iterations; i++) {",
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
        super();
        this.folder = info.gui.addFolder("StarField");

        this.geo = new THREE.PlaneGeometry(2,2);
        this.mat = new ShaderToyMaterial(fragmentShader, 
            {
                uniforms: { 
                    spe: {value: 1.8}
                }
            }
        );
        
        this.mesh = new THREE.Mesh(this.geo, this.mat);
        info.scene.add(this.mesh);


        //GUi
        this.brightenToAudio = true;
        this.brightenMultipler = 1;
        this.brightness = 1.0;
        this.setUpGUI(this.folder);
        this.impactAnalyser = new ImpactAnalyser(this.folder);
        this.impactAnalyser.endBin = 60;
        this.impactAnalyser.deltaDecay = 20;
        this.folder.updateDisplay();
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "brightenToAudio");
        folder.add(this, "brightness");
        folder.add(this, "brightenMultipler"); 
        return folder;
    }

    update = (time, audioData) => {
        this.mat.uniforms.iTime.value = time;
        if(this.brightenToAudio && this.impactAnalyser) {
            const impact = this.impactAnalyser.analyseImpact(audioData.frequencyData) ;
            this.mat.uniforms.spe.value = this.brightness + impact * this.brightenMultipler * -0.0005;
        }
    }
}