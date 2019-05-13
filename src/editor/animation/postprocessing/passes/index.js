import BloomPass from './bloompass'
import CopyShader from '../shaders/copyshader'
import GlitchPass from './glitchpass'
import FilmPass from './FilmPass'
import PixelPass from './PixelPass'

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

};

export function loadPassFromText(text) {
    if(text === "effect") {
        alert("Text should not be effect")
        return;
    }
        
    let C = passes[text].class;
    switch(text) {
        case "CopyPass":
            return new C(CopyShader);
        default:
            return new C();
    }
}

export { passes };

