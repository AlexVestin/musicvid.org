import BloomPass from './bloompass'
import CopyShader from '../shaders/copyshader'
import GlitchPass from './glitchpass'
import FilmPass from './FilmPass'

/*
import SSAAPass from './ssaapass'
import PixelPass from './pixelpass'
import HalftonePass from './halftonepass';
import ColorPass from './colorpass'
import ColorShader from '../shaders/colorshader'
import ShaderPass from './shaderpass';
import SepiaShader from '../shaders/sepiashader'
*/


const passes = {
    BloomPass: { class: BloomPass },
    GlitchPass: {img: "img/items/HexaGone.png", class: GlitchPass},
    FilmPass: {class: FilmPass}
};

export function loadPassFromText(text) {
    if(text === "effect") {
        alert("Text should not be effect")
        return;
    }
        
    let C = passes[text].class;
    switch(text) {
        case "FilmPass":
            return new FilmPass();
        case "CopyPass":
            return new C(CopyShader);
        case "GlitchPass":
            return new GlitchPass();
        case "RenderPass":
            return C;
        default:
            return new C();
    }
}

export { passes };

