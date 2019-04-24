

import EffectComposer from './effectcomposer'
import BloomPass from './passes/bloompass'
import SepiaShader from './shaders/sepiashader'
import ShaderPass from './passes/shaderpass';
import ColorShader from './shaders/colorshader'
import ColorPass from './passes/colorpass'
import CopyShader from './shaders/copyshader'
import SSAAPass from './passes/ssaapass'
import GlitchPass from './passes/glitchpass'
import HalftonePass from './passes/halftonepass';
import PixelPass from './passes/pixelpass'
import RenderPass from './passes/renderpass'


export default class PostProcessing {
    constructor(width, height, info, isMain = false) {
        this.width = width;
        this.height = height;

        const { renderer, gui, ovFolder } = info
        this.gui = gui;
        this.ovFolder = ovFolder;
        this.effectComposer = new EffectComposer(renderer)
        this.passes = [];
    }

    addRenderPass = (obj) => {
        const renderPass = new RenderPass( obj );
        this.effectComposer.addPass(renderPass);
        this.passes.push(obj);   
        this.effectComposer.passes.forEach((pass, i) => pass.clear = i === 0);
    }

    update = (time, audioData, shouldIncrement) => {
        this.passes.forEach( e => e.update(time, audioData, shouldIncrement) )
    }

    render = () => {
        this.effectComposer.render()
    }

    setSize = (width, height) => {
        this.effectComposer.setSize(width, height)
    }

 
    addEffectPass = (type, fileConfig) =>  {

        var fx;
        switch(type) {
            case "PIXEL":
                fx = new PixelPass({type, width: this.width, height: this.height, name: "Pixelpass"}, fileConfig);
            break;
            case "COLOR SHADER":
                fx = new ColorPass(ColorShader, {name: "color", type}, fileConfig)
                break;
            case "sepia":
                fx = new ShaderPass(SepiaShader)
                break;
            case "glitch":
                fx = new GlitchPass();
                break;
            case "BLOOM":
                fx = new BloomPass({type, name: "Bloom"}, 0.5, fileConfig)
                break;
            case "RGB HALFTONE":
                fx = new HalftonePass({width: this.width, height: this.height, name: "halftone"}, fileConfig)
                break;
            default:
                console.log("unknown EFFECTS type", type)
                return
        }

        fx.__setUpGUI(this.gui);
        
        fx.__setUpGUI(this.ovFolder);
        console.log(this.ovFolder);
        this.passes.push(fx);
        this.effectComposer.addPass(fx);        
    }

    removeEffect = (config) =>  {
        this.effectComposer.removePass(config);
        this.effectComposer.passes[this.effectComposer.passes.length - 1].renderToScreen = true
    }
}