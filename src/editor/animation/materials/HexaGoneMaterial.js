import * as THREE from 'three';
import ShaderToyMaterial from 'editor/animation/util/ShaderToyMaterial'
import fragShader from '../shaders/licensed/HexaGone'
import serialize from '../Serialize'

export default class HexaGoneMaterial extends ShaderToyMaterial {

    constructor(item) {
        super(
            fragShader,
            {
                uniforms: { 
                    iResolution: {value: new THREE.Vector2(item.width, item.height)},
                    iTime: {value: 0.0},
                    mult: {value: 4.0}
                }
            }
        )

        this.time = 0;
        this.amplitude = 10;
        this.baseSpeed = 0.8;

        this.transparent = true;
        
        item.__attribution = {
            showAttribution: true,
            name:"HexaGone",
            authors: [
                {
                    name: "BigWIngs", 
                    social1: {type: "youtube", url: "https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg"},
                    social2: {type: "twitter", url: "https://twitter.com/The_ArtOfCode"},
                }
            ],
            projectUrl: "https://www.shadertoy.com/view/wsl3WB",
            description: "",
            license: item.LICENSE.REQUIRE_ATTRIBUTION,
            changeDisclaimer: true,
            imageUrl: "img/templates/HexaGone.png"
        }     
        
        this.path = "material";
        this.__item = item;
    }

    stop = () => {
        this.time = 0;
    }

    updateMaterial = (time, dt, audioData) => {

        this.uniforms.iTime.value = time;
        this.time += this.baseSpeed * 0.01 + dt * this.amplitude / 10; 
        this.uniforms.iTime.value = this.time ;
    }

    __serialize = () => {
        return serialize(this);
    }

    __setUpGUI = (f) => {
        const i = this.__item;
        i.addController(f, this, "baseSpeed", {path: this.path});
        i.addController(f, this, "amplitude", {path: this.path});

        this.folder = f;
        return f;
    }
}