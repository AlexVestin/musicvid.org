import CopyShader from '../shaders/copyshader'
import GlitchPass from './glitchpass'
import FilmPass from './FilmPass'
import PixelPass from './pixelpass'
import BloomPass from './bloompass'
import UnrealBloomPass from './unrealbloompass'
import ShaderPass from './shaderpass'
import FXAAShader from '../shaders/fxaa' 
import HorizontalBlurPass from './HorizontalBlurPass';
import VerticalBlurPass from './VerticalBlurPass';


/*
import SSAAPass from './ssaapass'
import HalftonePass from './halftonepass';
import ColorPass from './colorpass'
import ColorShader from '../shaders/colorshader'
import ShaderPass from './shaderpass';
import SepiaShader from '../shaders/sepiashader'
*/


const passes = {
    BloomPass: { class: BloomPass },
    GlitchPass: {img: "img/items/HexaGone.png", class: GlitchPass},
    FilmPass: {class: FilmPass},
    PixelPass: {class: PixelPass},
    UnrealBloomPass: {class: UnrealBloomPass},
    FXAAPass: {isShaderPass: true, shader: FXAAShader},
    HorizontalBlurPass: {class: HorizontalBlurPass},
    VerticalBlurPass: {class: VerticalBlurPass}
};

export function loadPassFromText(text) {
    if(text === "effect") {
        alert("Text should not be effect")
        return;
    }


        
    let pass = passes[text];
    if (pass.isShaderPass) {
        return new ShaderPass(pass.shader);
    }

    let C = pass.class;
    switch(text) {
        case "CopyPass":
            return new C(CopyShader);
        default:
            return new C();
    }
}

export { passes };

